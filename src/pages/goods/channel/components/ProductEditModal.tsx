import React, { RefObject } from 'react';
import '@/styles/product.less';
import '@/styles/form.less';
import { Button, Modal, Form, Spin } from 'antd';
import { Bind } from 'lodash-decorators';
import { editChannelProductDetail, queryChannelProductDetail } from '@/services/channel';
import { FormInstance } from 'antd/es/form';
import NumberInput from '@/components/NumberInput';
import IntegerInput from '@/components/IntegerInput';
import { IChannelProductDetailResponse, ISku } from '@/interface/IChannel';
import { EmptyObject } from '@/config/global';

declare interface IProductEditProps {
    product_id: string;
    channel?: string;
}

declare interface IProductEditState extends Partial<IChannelProductDetailResponse> {
    loading: boolean;
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
        queryChannelProductDetail({ product_id, channel }).then(
            ({ data = EmptyObject } = EmptyObject) => {
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
            },
        );
    }

    @Bind
    private onClose() {
        Modal.destroyAll();
    }
    @Bind
    private diffSkuList(nextSkuList: ISku[], beforeSkuList: ISku[]) {
        // 仅 diff价格、运费、库存三个字段
        let updated = false;
        let i = 0;
        const length = nextSkuList.length;
        while (!updated && i < length) {
            const next = nextSkuList[i];
            const before = beforeSkuList[i];
            if (
                Number(next.price) !== Number(before.price) ||
                Number(next.storage) !== Number(before.storage) ||
                Number(next.shipping_fee) !== Number(before.shipping_fee)
            ) {
                updated = true;
            } else {
                i++;
            }
        }
        return updated;
    }
    @Bind
    private onSubmit() {
        const { product_id } = this.props;
        const { sku_list = [] } = this.formRef.current!.getFieldsValue();
        const { sku_list: _sku_list = [] } = this.state;
        // diff
        if (sku_list.length > 0 && this.diffSkuList(sku_list, _sku_list)) {
            this.setState({
                submitting: true,
            });
            editChannelProductDetail({
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
            loading,
        } = this.state;
        return (
            <Form
                className="form-help-absolute"
                layout="horizontal"
                autoComplete={'off'}
                ref={this.formRef}
            >
                <Spin spinning={loading}>
                    <div className="product-modal-content">
                        <div className="form-item">
                            <label className="ant-form-item-label">
                                商品&emsp;ID：{product_id}
                            </label>
                        </div>
                        <div className="form-item">
                            <label className="ant-form-item-label">
                                商品名称：
                                <div className="product-modal-item-value">{product_name}</div>
                            </label>
                        </div>
                        <div className="form-item">
                            <label className="ant-form-item-label">
                                商品描述：
                                <div className="product-modal-item-value">
                                    {product_description}
                                </div>
                            </label>
                        </div>
                        <div className="form-item">
                            <label className="ant-form-item-label">商品主图：</label>
                            {main_image ? (
                                <img
                                    src={main_image}
                                    className="product-modal-avatar"
                                    alt="avatar"
                                />
                            ) : (
                                <div className="product-modal-avatar" />
                            )}
                        </div>
                        {sku_list.map((sku: ISku, index: number) => {
                            const { specs = [], sku_name = '', sku_image } = sku;
                            return (
                                <div className="form-item flex flex-align" key={sku_name + index}>
                                    <div
                                        className="ant-form-item-label product-modal-item product-modal-name"
                                        title={sku_name}
                                    >
                                        <label title="sku名称">sku名称</label>
                                        <Form.Item
                                            noStyle={true}
                                            name={['sku_list', index, 'sku_name']}
                                        >
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
                                                    <div
                                                        key={name}
                                                        className="product-modal-specs-item"
                                                    >
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
                                        <NumberInput
                                            min={0}
                                            className="input-small input-handler"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="form-item-horizon form-item-inline"
                                        validateTrigger={'onBlur'}
                                        name={['sku_list', index, 'shipping_fee']}
                                        label="运费"
                                    >
                                        <NumberInput
                                            min={0}
                                            className="input-small input-handler"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="form-item-horizon form-item-inline"
                                        validateTrigger={'onBlur'}
                                        name={['sku_list', index, 'storage']}
                                        label="库存"
                                    >
                                        <IntegerInput
                                            min={0}
                                            className="input-small input-handler"
                                        />
                                    </Form.Item>
                                </div>
                            );
                        })}
                    </div>
                    <Button
                        loading={submitting}
                        type="primary"
                        className="float-right"
                        onClick={this.onSubmit}
                    >
                        确定
                    </Button>
                </Spin>
            </Form>
        );
    }
}

export default ProductEditModal;
