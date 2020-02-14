import React from 'react';
import { Modal } from 'antd';
import ProductEditModal from '@/pages/products/components/ProductEditModal';
import "@/styles/product.less";
import "@/styles/modal.less";

class Products extends React.PureComponent{
    componentDidMount(): void {
        Modal.info({
            className:"product-modal modal-empty",
            icon:null,
            title:"查看商品详情",
            cancelText:null,
            okText:null,
            content:<ProductEditModal product_id={1} channel="vova"/>,
        })
    }

    render(){
        return (
            <div>
                111
            </div>
        )
    }
}

export default Products;
