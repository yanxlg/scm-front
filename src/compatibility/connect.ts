import { connect as OriginConnect } from 'dva';

/**
 * Connects a React component to Dva.
 */
export const connect: (
    mapStateToProps?: Function,
    mapDispatchToProps?: Function,
    mergeProps?: Function,
    options?: Object,
) => Function = OriginConnect;
