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
    specs: {
        [key:string]:string;
    };
    price: string;
    freight: string;
    storage: string;
}

declare interface IFormData {
    sku_list: ISku[];
}

declare interface IProductEditProps{
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
    submitting:boolean;
}

class ProductEditModal extends React.PureComponent<IProductEditProps, IProductEditState> {
    private formRef:RefObject<FormInstance> = React.createRef();
    constructor(props: IProductEditProps) {
        super(props);
        this.state = {
            loading: true,
            submitting:false
        };
    }
    componentDidMount(): void {
        this.queryDetail();
    }
    @Bind
    private queryDetail() {
        const { product_id, channel } = this.props;
        queryGoodsDetail({ product_id, channel }).then(({ data = {} }) => {
            this.setState({
                loading: false,
                ...data,
            },()=>{
                this.formRef.current!.setFieldsValue({
                    sku_list: data.sku_list,
                });
            });
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
        const skuString = JSON.stringify(sku_list);
        if (JSON.stringify(sku_list) !== JSON.stringify(_sku_list)) {
            this.setState({
                submitting:true
            });
            editGoodsDetail({
                goods_id: product_id,
                sku_list: skuString,
            }).then(() => {
                this.onClose();
            }).finally(()=>{
                this.setState({submitting:false})
            });
        } else {
            this.onClose();
        }
    }
    render() {
        const { product_id, product_name, main_image, product_description,sku_list=[],submitting } = this.state;
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
                    {
                        main_image
                            ?
                            <img src={main_image} className="product-modal-avatar" alt="avatar" />:<div className="product-modal-avatar"/>
                    }
                </div>
                {sku_list.map((sku: ISku, index: number) => {
                    const specsChild =[];
                    const {specs={}} = sku;
                    for (let key in specs){
                        specsChild.push(<div key={key}>{key}:{specs[key]}</div>)
                    }
                    return (
                        <div className="form-item flex flex-align" key={sku.sku_name + index}>
                            <div className="ant-form-item-label product-modal-item product-modal-name" title={sku.sku_name}>
                                <label title="sku名称">sku名称</label>
                                {sku.sku_name}
                            </div>
                            <div className="ant-form-item-label product-modal-item flex flex-align">
                                <label title="对应图片">对应图片</label>
                                {
                                    sku.sku_image
                                        ?
                                        <img src={sku.sku_image} className="product-modal-avatar-small" alt="avatar" />:<div className="product-modal-avatar-small"/>
                                }
                            </div>
                            <div className="ant-form-item-label product-modal-item product-modal-specs flex flex-align">
                                <label title="商品规格">商品规格</label>
                                <div title={JSON.stringify(specs)} className="product-modal-specs-ellipse">
                                    {
                                        specsChild
                                    }
                                </div>
                            </div>
                            <Form.Item
                                className="form-item-horizon form-item-inline"
                                validateTrigger={'onBlur'}
                                name={["sku_list",index,"price"]}
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
                                name={["sku_list",index,"freight"]}
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
                                name={["sku_list",index,"storage"]}
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
                <Button loading={submitting} type="primary" className="float-right" onClick={this.onSubmit}>
                    确定
                </Button>
            </Form>
        );
    }
}

export default ProductEditModal;
