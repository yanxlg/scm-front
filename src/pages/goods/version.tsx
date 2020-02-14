import React from 'react';

import VersionTable from './components/VersionTable';



import '../../styles/goods-version.less';

class Version extends React.PureComponent {

    render() {
        return (
            <div className="goods-version">
                <div className="goods-version-current">
                    <img src="//image-tb.airyclub.com/image/500_500/filler/26/61/6b075aafdcbf2c47ccc97ea3d5892661.jpg"/>
                    <div className="info">
                        <p>
                            商品标题：【6期免息赠耳机】OPPO Reno Ace骁龙855plus智能游戏手机90Hz全面屏65W…… <a>【查看源商品】</a>
                        </p>
                        <p>
                            <span>中台商品ID：5673678</span>
                        </p>
                        <p>
                            <span>类目：电子/智能手机</span>
                            <span>品牌: OPPO</span>
                        </p>
                    </div>
                </div>
                <VersionTable />
            </div>
        )
    }
}

export default Version;
