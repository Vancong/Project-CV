import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as Product from "../../services/Product.Services";
import CardComponent from "../CardComponent/CardComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import './ProductListSection.scss'
const ProductListSection = ({ title, queryKey, keySort, valueSort }) => {
  const [limit, setLimit] = useState(10);

  const fetchProducts = async () => {
    const res = await Product.getAllProduct({ limit, key: keySort, value: valueSort });
    return res;
  };

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: [queryKey, limit],
    queryFn: fetchProducts,
    keepPreviousData: true,
    retry: 3,
    retryDelay: 1000,
  });

  return (
    <LoadingComponent isPending={isLoading}>
        <div className="product_list_section">
            <h1 className="title">{title}</h1>
            <div className="card">
                {data?.data?.map((product) => (
                <CardComponent key={product._id} product={product} {...product} />
                ))}
            </div>
            <div className="button">
                <ButtonComponent
                className="color-main button_hover"
                textButton={isPreviousData ? "Đang tải..." : "Xem thêm"}
                type="outline"
                styleTextButton={{ fontWeight: 500 }}
                styleButton={{ border: "1px solid", height: "38px", width: "120px" }}
                onClick={() => setLimit((pre) => pre + 4)}
                disabled={data?.total === data?.data?.length}
                />
            </div>
        </div>
    </LoadingComponent>
  );
};

export default ProductListSection;
