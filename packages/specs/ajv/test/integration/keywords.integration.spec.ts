import "@tsed/ajv";
import {PlatformTest} from "@tsed/common";
import {array, CustomKey, getJsonSchema, number} from "@tsed/schema";
import Ajv, {_, KeywordCxt} from "ajv";
import {expect} from "chai";
import {Keyword} from "../../src/decorators/keyword";
import {KeywordMethods} from "../../src/interfaces/KeywordMethods";

@Keyword({
  keyword: "range",
  type: "number",
  schemaType: "array",
  implements: ["exclusiveRange"],
  metaSchema: array().items([number(), number()]).minItems(2).additionalItems(false)
})
class RangeKeyword implements KeywordMethods {
  compile([min, max]: number[], parentSchema: any) {
    return parentSchema.exclusiveRange === true ? (data: any) => data > min && data < max : (data: any) => data >= min && data <= max;
  }
}

@Keyword({
  keyword: "even",
  type: "number",
  schemaType: "boolean"
})
class EvenKeyword implements KeywordMethods {
  code(cxt: KeywordCxt) {
    const {data, schema} = cxt;
    const op = schema ? _`!==` : _`===`;
    cxt.fail(_`${data} %2 ${op} 0`);
  }
}

export class Product {
  @CustomKey("range", [10, 100])
  @CustomKey("exclusiveRange", true)
  price: number;
}

describe("Keywords", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should call custom keyword validation (compile)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = {range: [2, 4], exclusiveRange: true};

    const validate = ajv.compile(schema);

    expect(validate(2.01)).to.eq(true);
    expect(validate(3.99)).to.eq(true);
    expect(validate(2)).to.eq(false);
    expect(validate(4)).to.eq(false);
  });
  it("should call custom keyword validation (code)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = {even: true};

    const validate = ajv.compile(schema);

    expect(validate(2)).to.eq(true);
    expect(validate(3)).to.eq(false);
  });

  it("should call custom keyword validation (model)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = getJsonSchema(Product, {customKeys: true});

    const validate = ajv.compile(schema);

    expect(schema).to.deep.equal({
      properties: {
        price: {
          exclusiveRange: true,
          range: [10, 100],
          type: "number"
        }
      },
      type: "object"
    });
    expect(validate({price: 10.01})).to.eq(true);
    expect(validate({price: 99.99})).to.eq(true);
    expect(validate({price: 10})).to.eq(false);
    expect(validate({price: 100})).to.eq(false);
  });
});
