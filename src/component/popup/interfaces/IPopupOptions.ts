import {Alignment} from "../../../Viewer";

/**
 * Interface for the options that define behavior and
 * appearance of a popup.
 *
 * @interface
 */
export interface IPopupOptions {
    /**
     * Specify that the popup should not have any tooltip
     * like visuals around the provided content.
     *
     * @default false
     */
    clean?: boolean;

    /**
     * The direction in which the popup floats with respect to the
     * anchor point or points. If no value is supplied the popup
     * will change float automatically based on the its position
     * in the viewport so that as much of its area as possible is
     * visible.
     *
     * @description For automatic floating (undefined) the popup
     * will float in eight directions around a point or a position
     * in a rect. When a rectangle is set without a position option
     * specified, the popup will float outward from the rectangle
     * center based on the side it is currently rendered in. The
     * default floating direction is to the bottom for both points
     * and rectangles.
     *
     * @default undefined
     */
    float?: Alignment;

    /**
     * Offset in pixels in the float direction that the popup
     * will be translated with respect to the current anchor point.
     *
     * @default 0
     */
    offset?: number;

    /**
     * Opacity of the popup visuals.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * The popup position in a rectangle (does not apply to points).
     * When not set the popup will change position automatically
     * based on the viewport so that as much of it as possible is
     * visible.
     *
     * @default undefined
     */
    position?: Alignment;
}

export default IPopupOptions;
