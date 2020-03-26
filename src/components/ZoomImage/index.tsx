import React from 'react';
import Viewer from 'react-viewer';
import { ToolbarConfig } from 'react-viewer/lib/ViewerProps';

declare interface ZoomImageProps {
    className?: string;
    src: string;
}

declare interface ZoomImageState {
    visible: boolean;
}

const customToolbar = [
    {
        prev: false,
    },
    {
        next: false,
    },
];

class ZoomImage extends React.PureComponent<ZoomImageProps, ZoomImageState> {
    constructor(props: ZoomImageProps) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    private onShow = () => {
        this.setState({
            visible: true,
        });
    };

    private onClose = () => {
        this.setState({
            visible: false,
        });
    };

    customToolbar = (list: ToolbarConfig[]) => {
        // console.log(list)
        return list.filter(item => ['prev', 'next'].indexOf(item.key) === -1);
    };

    render() {
        const { src } = this.props;
        const { visible } = this.state;

        return (
            <>
                <img {...this.props} style={{ cursor: 'zoom-in' }} onClick={this.onShow} />
                <Viewer
                    visible={visible}
                    images={[{ src: src, alt: '' }]}
                    onMaskClick={this.onClose}
                    onClose={this.onClose}
                    customToolbar={this.customToolbar}
                />
            </>
        );
    }
}

export default ZoomImage;
