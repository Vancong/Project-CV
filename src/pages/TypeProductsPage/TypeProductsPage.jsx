import React, {  useState } from 'react'
import FilterSidebarComponent from '../../components/FilterSidebarComponent/FilterSidebarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import {Row,Col, Pagination, Select} from "antd";
import './TypeProductsPage.scss';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import *as ProductService from "../../services/Product.Services"
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import NavigationPathComponent from '../../components/NavigationPathComponent/NavigationPathComponent';
import *as FavoriteService from "../../services/Favorite.Service"
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
const TypeProductsPage = () => {

  const location = useLocation();
  let {state}=location;
  const [searchParams] =useSearchParams();
  const {type:slug}=useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const limit=10;
  const [sortOption, setSortOption] = useState('newProduct');
  const [keyValue,setKeyValue]=useState({key:'createdAt',value:-1})
  const searchKeyword = useSelector(state => state.product.search);
  const user=useSelector((state)=>state.user)

  const genderMap = {
      'Nước Hoa Nam': 'Male',
      'Nước Hoa Nữ': 'Female',
      'Nước Hoa Unisex': 'Unisex',
      'nuoc-hoa-nam': 'Male',
      'nuoc-hoa-nu': 'Female',
      'nuoc-hoa-unisex': 'Unisex',
  };

  let filters = {
      gender: searchParams.get('gender') || '',
      notes: searchParams.get('notes')?.split(',') || [],
      price: searchParams.get('price') || '',
      brands: searchParams.get('brands')?.split(',') || [],
  };

  const buildFilters = () => {
      const onFilters = {};
      if (filters?.gender) {
        onFilters.gender = genderMap[filters.gender];

      } else if (slug !== 'loc-san-pham' && slug !== 'dealthom') {
        onFilters.gender = genderMap[slug];
      }
      if (filters?.price) onFilters.price = filters.price;
      if (filters?.brands?.length) onFilters.brands = filters.brands;
      if (filters?.notes?.length) onFilters.notes = filters.notes;
      
      if (slug === 'deal-thom') {
        onFilters.discount = true; 
      }
      return onFilters;
    };

   filters = buildFilters();


  let { data:products, isLoading } = useQuery({
    queryKey: ['products-type', slug,currentPage,limit,filters,searchKeyword,keyValue],
    queryFn: () => ProductService.getAllProduct({ page: currentPage, limit, filters,
      search:searchKeyword,key:keyValue.key,value:keyValue.value }),
    keepPreviousData: true,
    enabled: slug !== 'favorite' 
  });


   const { data:productsFavorite, isLoadingFavorite } = useQuery({
    queryKey: ['products-favorite', slug],
    queryFn: () => FavoriteService.getUserFavorite(user?.id,user.access_token ),
    keepPreviousData: true
  });


  const onChangeValue=(value) => {
    setSortOption(value);
    if(value==='newProduct'){
      setKeyValue({ key: 'createdAt', value: -1 });
    }
    else if (value==='price-desc'){
      setKeyValue({ key: 'price', value: -1 });
    }
    else if (value==='price-asc' ){
      setKeyValue({ key: 'price', value: 1 });
    }

    setCurrentPage(1)
  }
  
  let productDataRender=products?.data;

  if(!state&&slug==='search'){
    state=`Kết quả tìm kiếm cua "${searchKeyword}"`
  }
  else if (!state&&slug==='favorite'){
    state=`Sản phẩm yêu thích`
    productDataRender=productsFavorite?.data;
    productDataRender=productDataRender?.filter(item =>  item!==null)
  }

  return (
    <LoadingComponent isPending={isLoading} >
      <div className='container'>
        <div className='type_product'>
            <NavigationPathComponent category={state} />
            <h1 className='title_slug'>
                {
                  productDataRender?.length===0
                    ? state
                      ? `${state} - Không tìm thấy sản phẩm nào!`
                      : 'Không tìm thấy sản phẩm nào!'
                    : slug === 'loc-san-pham'
                      ? 'Kết quả lọc sản phẩm'
                      : state
                }
             </h1>
      

             
            <div>
                <Row  gutter={24} wrap style={{ paddingTop: '10px' }}>

                    {slug!=='search'&&slug!=='favorite' && (
                        <Col span={6} className='col_navbar'>
                          <FilterSidebarComponent slug={slug} setCurrentPage={setCurrentPage}                                               
                          />
                        </Col>
                    )}
                    <Col span={slug==='search' || slug==='favorite' ? 24 : 18}>
               
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px',justifyContent:'center' }}>
                            {productDataRender?.map(product => (
                              <CardComponent
                                width={216}
                                key={product._id}
                                images={product.images}
                                name={product.name}
                                sizes={product.sizes}
                                selled={product.selled}
                                slug={product.slug}
                                state={state}
                                product={product}
                              />
                            ))}
                        </div>   

                    </Col>
                </Row>
                
                  {productDataRender?.length>0&&(
                    <div className='pagination-wrapper'>
                      <Pagination 
                      total={products?.total}
                      current={currentPage} 
                      pageSize={limit}
                      onChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  )}
            </div>
        </div>
      </div>
   </LoadingComponent>
  )
}

export default TypeProductsPage



