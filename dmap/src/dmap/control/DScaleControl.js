import DBaseControl from "./DBaseControl";

/**
 * 地图比例尺控件
 */
export default class DScaleControl extends DBaseControl{
    constructor(options) {
        let use_options = {
            on2D: true,
            on3D: true,
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;

        this.create();
    }
}