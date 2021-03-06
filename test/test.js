import { handleTripCategory } from "../src/js/library/handle_trip_category";
import { tripCatagory } from "./test_data/trip_category";
import renderer from "react-test-renderer";

describe("handleTripCategory", () => {
    it("start is equal to today", () => {
        expect(handleTripCategory(tripCatagory.data_1)).toEqual(
            tripCatagory.result_1
        );
    });
    it("end is equal to today", () => {
        expect(handleTripCategory(tripCatagory.data_2)).toEqual(
            tripCatagory.result_2
        );
    });
    it("end is less than today", () => {
        expect(handleTripCategory(tripCatagory.data_3)).toEqual(
            tripCatagory.result_3
        );
    });
    it("start is more than today", () => {
        expect(handleTripCategory(tripCatagory.data_4)).toEqual(
            tripCatagory.result_4
        );
    });
});