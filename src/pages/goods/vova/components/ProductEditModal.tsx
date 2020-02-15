import React from 'react';
import { Form } from '@/components/Form';
import { FormComponentProps } from 'antd/lib/form';
import '@/styles/product.less';
import '@/styles/form.less';
import { Button, Icon, InputNumber, Modal } from 'antd';
import { numberFormatter } from '@/utils/common';
import { Bind } from 'lodash-decorators';
import { editGoodsDetail, queryGoodsDetail } from '@/services/products';

declare interface ISku {
    sku_name: string;
    sku_image: string;
    specs: {
        size: string;
        color: string;
    };
    price: string;
    freight: string;
    storage: string;
}

declare interface IFormData {
    sku_list: ISku[];
}

declare interface IProductEditProps extends FormComponentProps<IFormData> {
    product_id: number;
    channel?: string;
}

declare interface IProductEditState {
    loading: boolean;
    product_id?: string;
    product_name?: string;
    main_image?: string;
    product_description?: string;
    sku_list?: ISku[];
}

class _ProductEditModal extends Form.BaseForm<IProductEditProps, IProductEditState> {
    constructor(props: IProductEditProps) {
        super(props);
        this.state = {
            loading: true,
        };
    }
    componentDidMount(): void {
        this.queryDetail();
    }
    @Bind
    private queryDetail() {
        const { product_id, channel, form } = this.props;
        queryGoodsDetail({ product_id, channel }).then(({ data = {} }) => {
            form.setFieldsValue({
                sku_list: data.sku_list,
            });
            this.setState({
                loading: false,
                ...data,
            });
        });
    }

    @Bind
    private onClose() {
        Modal.destroyAll();
    }
    @Bind
    private onSubmit() {
        const { form, product_id } = this.props;
        const { sku_list = [] } = form.getFieldsValue();
        const { sku_list: _sku_list } = this.state;
        // diff
        const skuString = JSON.stringify(sku_list);
        if (JSON.stringify(sku_list) !== JSON.stringify(_sku_list)) {
            editGoodsDetail({
                goods_id: product_id,
                sku_list: skuString,
            }).then(() => {
                this.onClose();
            });
        } else {
            this.onClose();
        }
    }
    render() {
        const { form } = this.props;
        const { product_id, product_name, main_image, product_description } = this.state;
        const sku_list = form.getFieldValue('sku_list') || [];
        return (
            <Form className="form-help-absolute" layout="inline" autoComplete={'off'}>
                <button className="ant-modal-close block" onClick={this.onClose}>
                    <div className="ant-modal-close-x">
                        <Icon type="close" />
                    </div>
                </button>
                <div className="form-item">
                    <label className="ant-form-item-label">商品&emsp;ID：{product_id}</label>
                    <span className="product-modal-value">1111</span>
                </div>
                <div className="form-item">
                    <label className="ant-form-item-label">商品名称：{product_name}</label>
                    <span className="product-modal-value">1111</span>
                </div>
                <div className="form-item">
                    <label className="ant-form-item-label">商品描述：{product_description}</label>
                    <span className="product-modal-value">1111</span>
                </div>
                <div className="form-item">
                    <label className="ant-form-item-label">商品主图：</label>
                    <img src={main_image} className="product-modal-avatar" alt="avatar" />
                </div>
                {sku_list.map((sku: ISku, index: number) => {
                    return (
                        <div className="form-item" key={sku.sku_name + index}>
                            <div className="inline-block ant-form-item-label">
                                <label title="sku名称">sku名称</label>
                                {sku.sku_name}
                            </div>
                            <div className="inline-block ant-form-item-label">
                                <label title="对应图片">对应图片</label>
                                <img
                                    src={sku.sku_image}
                                    className="product-modal-avatar-small"
                                    alt="avatar"
                                />
                            </div>
                            <div className="inline-block ant-form-item-label">
                                <label title="商品规格">商品规格</label>
                                color:{sku.specs.color}
                                size:{sku.specs.size}
                            </div>
                            <Form.Item
                                className="inline-block"
                                validateTrigger={'onBlur'}
                                form={form}
                                name="sku[index].price"
                                label="价格"
                            >
                                <InputNumber
                                    min={0}
                                    className="input-small input-handler"
                                    formatter={numberFormatter}
                                />
                            </Form.Item>
                            <Form.Item
                                className="inline-block"
                                validateTrigger={'onBlur'}
                                form={form}
                                name="sku[index].freight"
                                label="运费"
                            >
                                <InputNumber
                                    min={0}
                                    className="input-small input-handler"
                                    formatter={numberFormatter}
                                />
                            </Form.Item>
                            <Form.Item
                                className="inline-block"
                                validateTrigger={'onBlur'}
                                form={form}
                                name="sku[index].storage"
                                label="库存"
                            >
                                <InputNumber
                                    min={0}
                                    className="input-small input-handler"
                                    formatter={numberFormatter}
                                />
                            </Form.Item>
                        </div>
                    );
                })}
                <Button type="primary" className="float-right" onClick={this.onSubmit}>
                    确定
                </Button>
            </Form>
        );
    }
}

const ProductEditModal = Form.create<IProductEditProps>()(_ProductEditModal);

export default ProductEditModal;
