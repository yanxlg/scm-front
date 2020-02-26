import React, { RefObject } from 'react';
import '@/styles/product.less';
import '@/styles/form.less';
import { Button, InputNumber, Modal, Form } from 'antd';
import { numberFormatter } from '@/utils/common';
import { Bind } from 'lodash-decorators';
import { editGoodsDetail, queryGoodsDetail } from '@/services/vova';
import { FormInstance } from 'antd/es/form';
import { CloseOutlined } from '@ant-design/icons/lib';

declare interface ISku {
    sku_name: string;
    sku_image: string;
    specs: Array<{
        name: string;
        value: string;
    }>;
    price: string;
    shipping_fee: string;
    storage: string;
}

declare interface IFormData {
    sku_list: ISku[];
}

declare interface IProductEditProps {
    product_id: string;
    channel?: string;
}

declare interface IProductEditState {
    loading: boolean;
    product_id?: string;
    product_name?: string;
    main_image?: string;
    product_description?: string;
    sku_list?: ISku[];
    submitting: boolean;
}

class ProductEditModal extends React.PureComponent<IProductEditProps, IProductEditState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    constructor(props: IProductEditProps) {
        super(props);
        this.state = {
            loading: true,
            submitting: false,
        };
    }
    componentDidMount(): void {
        this.queryDetail();
    }
    @Bind
    private queryDetail() {
        const { product_id, channel } = this.props;
        queryGoodsDetail({ product_id, channel }).then(({ data = {} }) => {
            this.setState(
                {
                    loading: false,
                    ...data,
                },
                () => {
                    this.formRef.current!.setFieldsValue({
                        sku_list: data.sku_list,
                    });
                },
            );
        });
    }

    @Bind
    private onClose() {
        Modal.destroyAll();
    }
    @Bind
    private onSubmit() {
        const { product_id } = this.props;
        const { sku_list = [] } = this.formRef.current!.getFieldsValue();
        const { sku_list: _sku_list } = this.state;
        // diff
        if (sku_list.length > 0 && JSON.stringify(sku_list) !== JSON.stringify(_sku_list)) {
            this.setState({
                submitting: true,
            });
            editGoodsDetail({
                product_id: product_id,
                sku_list: sku_list.map((sku: ISku) => {
                    return {
                        sku: sku.sku_name,
                        shop_price: sku.price,
                        shipping_fee: sku.shipping_fee,
                        storage: sku.storage,
                    };
                }),
            })
                .then(() => {
                    this.onClose();
                })
                .finally(() => {
                    this.setState({ submitting: false });
                });
        } else {
            this.onClose();
        }
    }
    render() {
        const {
            product_id,
            product_name,
            main_image,
            product_description,
            sku_list = [],
            submitting,
        } = this.state;
        return (
            <Form
                className="form-help-absolute"
                layout="horizontal"
                autoComplete={'off'}
                ref={this.formRef}
            >
                <button className="ant-modal-close block" onClick={this.onClose}>
                    <div className="ant-modal-close-x">
                        <CloseOutlined />
                    </div>
                </button>
                <div className="form-item">
                    <label className="ant-form-item-label">商品&emsp;ID：{product_id}</label>
                </div>
                <div className="form-item">
                    <label className="ant-form-item-label">商品名称：{product_name}</label>
                </div>
                <div className="form-item">
                    <label className="ant-form-item-label">商品描述：{product_description}</label>
                </div>
                <div className="form-item">
                    <label className="ant-form-item-label">商品主图：</label>
                    {main_image ? (
                        <img src={main_image} className="product-modal-avatar" alt="avatar" />
                    ) : (
                        <div className="product-modal-avatar" />
                    )}
                </div>
                {sku_list.map((sku: ISku, index: number) => {
                    const { specs = [], sku_name, sku_image } = sku;
                    return (
                        <div className="form-item flex flex-align" key={sku_name + index}>
                            <div
                                className="ant-form-item-label product-modal-item product-modal-name"
                                title={sku_name}
                            >
                                <label title="sku名称">sku名称</label>
                                <Form.Item noStyle={true} name={['sku_list', index, 'sku_name']}>
                                    <span>{sku_name}</span>
                                </Form.Item>
                            </div>
                            <div className="ant-form-item-label product-modal-item flex flex-align">
                                <label title="对应图片">对应图片</label>
                                {sku_image ? (
                                    <img
                                        src={sku_image}
                                        className="product-modal-avatar-small"
                                        alt="avatar"
                                    />
                                ) : (
                                    <div className="product-modal-avatar-small" />
                                )}
                            </div>
                            <div className="ant-form-item-label product-modal-item product-modal-specs flex flex-align">
                                <label title="商品规格">商品规格</label>
                                <div className="product-modal-specs-value">
                                    {specs.map(({ name, value }) => {
                                        return (
                                            <div key={name} className="product-modal-specs-item">
                                                {name}:{value}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <Form.Item
                                className="form-item-horizon form-item-inline"
                                validateTrigger={'onBlur'}
                                name={['sku_list', index, 'price']}
                                label="价格"
                            >
                                <InputNumber
                                    min={0}
                                    className="input-small input-handler"
                                    formatter={numberFormatter}
                                />
                            </Form.Item>
                            <Form.Item
                                className="form-item-horizon form-item-inline"
                                validateTrigger={'onBlur'}
                                name={['sku_list', index, 'shipping_fee']}
                                label="运费"
                            >
                                <InputNumber
                                    min={0}
                                    className="input-small input-handler"
                                    formatter={numberFormatter}
                                />
                            </Form.Item>
                            <Form.Item
                                className="form-item-horizon form-item-inline"
                                validateTrigger={'onBlur'}
                                name={['sku_list', index, 'storage']}
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
                <Button
                    loading={submitting}
                    type="primary"
                    className="float-right"
                    onClick={this.onSubmit}
                >
                    确定
                </Button>
            </Form>
        );
    }
}

export default ProductEditModal;
