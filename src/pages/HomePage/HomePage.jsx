
import "./style.scss";
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import ProductListSection from "../../components/ProductListSection/ProductListSection";
import Footer from '../../components/Footer/Footer';
import { useSelector } from "react-redux";
const HomePage = () => {
  const websiteInfo=useSelector(state => state.websiteInfo);

  return (
   <>

        <SliderComponent type='banner' arrImages={websiteInfo?.banner} autoplay={true} />
        <div className='container home_page'>

            <ProductListSection 
                title="Sản phẩm đang trong thời gian khuyến mãi" 
                queryKey="saleProducts" 
                keySort="discount" 
                valueSort={-1} 
              />

              <ProductListSection 
                title="Sản phẩm mới nhất" 
                queryKey="newProducts" 
                keySort="createdAt" 
                valueSort={-1} 
              />
          </div>

          <Footer />
          
   </>
  )
}

export default HomePage