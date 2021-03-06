/**
 * Enumeration for tag modes
 * @enum {number}
 * @readonly
 * @description Modes for the interaction in the tag component.
 */
export enum TagMode {
    /**
     * Disables creating tags.
     */
    Default,

    /**
     * Create a point geometry through a click.
     */
    CreatePoint,

    /**
     * Create a polygon geometry through clicks.
     */
    CreatePolygon,

    /**
     * Create a rect geometry through clicks.
     */
    CreateRect,
}

export default TagMode;
