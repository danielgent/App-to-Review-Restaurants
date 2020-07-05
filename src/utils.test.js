import {
  convertIsoStringToDateObject,
  convertDateObjectToIsoString,
} from "./utils";

describe("Utils tests", () => {
  it("should convert to date object from ISO string", () => {
    const newDateObj = convertIsoStringToDateObject("2020-6-5");

    const expectedResult = new Date(2020, 5, 5).getTime();

    expect(newDateObj.getTime()).toEqual(expectedResult);
  });

  it("should convert from date object to ISO string", () => {
    const inputDate = new Date(2020, 5, 15);

    const isoString = convertDateObjectToIsoString(inputDate);

    expect(isoString).toEqual("2020-6-15");
  });
});
