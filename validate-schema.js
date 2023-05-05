
const jsonSchema = {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "The Root Schema",
    "required": ["groupedtabs"],
    "properties": {
        "groupedtabs": {
            "$id": "#/properties/groupedtabs",
            "type": "array",
            "title": "The Groupedtabs Schema",
            "items": {
                "$id": "#/properties/groupedtabs/items",
                "type": "object",
                "title": "The Items Schema",
                "required": ["name", "tablist"],
                "properties": {
                    "name": {
                        "$id": "#/properties/groupedtabs/items/properties/name",
                        "type": "string",
                        "title": "The Name Schema",
                        "default": "",
                        "examples": ["test"],
                        "pattern": "^(.*)$"
                    },
                    "tablist": {
                        "$id": "#/properties/groupedtabs/items/properties/tablist",
                        "type": "array",
                        "title": "The Tablist Schema",
                        "items": {
                            "$id": "#/properties/groupedtabs/items/properties/tablist/items",
                            "type": "object",
                            "title": "The Items Schema",
                            "required": ["title", "url"],
                            "properties": {
                                "title": {
                                    "$id": "#/properties/groupedtabs/items/properties/tablist/items/properties/title",
                                    "type": "string",
                                    "title": "The Title Schema",
                                    "default": "",
                                    "examples": [""],
                                    "pattern": "^(.*)$"
                                },
                                "url": {
                                    "$id": "#/properties/groupedtabs/items/properties/tablist/items/properties/url",
                                    "type": "string",
                                    "title": "The Url Schema",
                                    "default": "",
                                    "examples": [""],
                                    "pattern": "^(.*)$"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const pattern0 = new RegExp("^(.*)$", "u");

function validateSchema(data, {
    instancePath = "",
    parentData,
    parentDataProperty,
    rootData = data
} = {}) {
    let vErrors = null;
    let errors = 0;
    if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            let missing0;
            if ((data.groupedtabs === undefined) && (missing0 = "groupedtabs")) {
                validateSchema.errors = [{
                    instancePath,
                    schemaPath: "#/required",
                    keyword: "required",
                    params: {
                        missingProperty: missing0
                    },
                    message: "must have required property '" + missing0 + "'"
                }];
                return false;
            } else {
                if (data.groupedtabs !== undefined) {
                    let data0 = data.groupedtabs;
                    const _errs1 = errors;
                    if (errors === _errs1) {
                        if (Array.isArray(data0)) {
                            var valid1 = true;
                            const len0 = data0.length;
                            for (let i0 = 0; i0 < len0; i0++) {
                                let data1 = data0[i0];
                                const _errs3 = errors;
                                if (errors === _errs3) {
                                    if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
                                        let missing1;
                                        if (((data1.name === undefined) && (missing1 = "name")) || ((data1.tablist === undefined) && (missing1 = "tablist"))) {
                                            validateSchema.errors = [{
                                                instancePath: instancePath + "/groupedtabs/" + i0,
                                                schemaPath: "#/properties/groupedtabs/items/required",
                                                keyword: "required",
                                                params: {
                                                    missingProperty: missing1
                                                },
                                                message: "must have required property '" + missing1 + "'"
                                            }];
                                            return false;
                                        } else {
                                            if (data1.name !== undefined) {
                                                let data2 = data1.name;
                                                const _errs5 = errors;
                                                if (errors === _errs5) {
                                                    if (typeof data2 === "string") {
                                                        if (!pattern0.test(data2)) {
                                                            validateSchema.errors = [{
                                                                instancePath: instancePath + "/groupedtabs/" + i0 + "/name",
                                                                schemaPath: "#/properties/groupedtabs/items/properties/name/pattern",
                                                                keyword: "pattern",
                                                                params: {
                                                                    pattern: "^(.*)$"
                                                                },
                                                                message: "must match pattern \"" + "^(.*)$" + "\""
                                                            }];
                                                            return false;
                                                        }
                                                    } else {
                                                        validateSchema.errors = [{
                                                            instancePath: instancePath + "/groupedtabs/" + i0 + "/name",
                                                            schemaPath: "#/properties/groupedtabs/items/properties/name/type",
                                                            keyword: "type",
                                                            params: {
                                                                type: "string"
                                                            },
                                                            message: "must be string"
                                                        }];
                                                        return false;
                                                    }
                                                }
                                                var valid2 = _errs5 === errors;
                                            } else {
                                                var valid2 = true;
                                            }
                                            if (valid2) {
                                                if (data1.tablist !== undefined) {
                                                    let data3 = data1.tablist;
                                                    const _errs7 = errors;
                                                    if (errors === _errs7) {
                                                        if (Array.isArray(data3)) {
                                                            var valid3 = true;
                                                            const len1 = data3.length;
                                                            for (let i1 = 0; i1 < len1; i1++) {
                                                                let data4 = data3[i1];
                                                                const _errs9 = errors;
                                                                if (errors === _errs9) {
                                                                    if (data4 && typeof data4 == "object" && !Array.isArray(data4)) {
                                                                        let missing2;
                                                                        if (((data4.title === undefined) && (missing2 = "title")) || ((data4.url === undefined) && (missing2 = "url"))) {
                                                                            validateSchema.errors = [{
                                                                                instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist/" + i1,
                                                                                schemaPath: "#/properties/groupedtabs/items/properties/tablist/items/required",
                                                                                keyword: "required",
                                                                                params: {
                                                                                    missingProperty: missing2
                                                                                },
                                                                                message: "must have required property '" + missing2 + "'"
                                                                            }];
                                                                            return false;
                                                                        } else {
                                                                            if (data4.title !== undefined) {
                                                                                let data5 = data4.title;
                                                                                const _errs11 = errors;
                                                                                if (errors === _errs11) {
                                                                                    if (typeof data5 === "string") {
                                                                                        if (!pattern0.test(data5)) {
                                                                                            validateSchema.errors = [{
                                                                                                instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist/" + i1 + "/title",
                                                                                                schemaPath: "#/properties/groupedtabs/items/properties/tablist/items/properties/title/pattern",
                                                                                                keyword: "pattern",
                                                                                                params: {
                                                                                                    pattern: "^(.*)$"
                                                                                                },
                                                                                                message: "must match pattern \"" + "^(.*)$" + "\""
                                                                                            }];
                                                                                            return false;
                                                                                        }
                                                                                    } else {
                                                                                        validateSchema.errors = [{
                                                                                            instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist/" + i1 + "/title",
                                                                                            schemaPath: "#/properties/groupedtabs/items/properties/tablist/items/properties/title/type",
                                                                                            keyword: "type",
                                                                                            params: {
                                                                                                type: "string"
                                                                                            },
                                                                                            message: "must be string"
                                                                                        }];
                                                                                        return false;
                                                                                    }
                                                                                }
                                                                                var valid4 = _errs11 === errors;
                                                                            } else {
                                                                                var valid4 = true;
                                                                            }
                                                                            if (valid4) {
                                                                                if (data4.url !== undefined) {
                                                                                    let data6 = data4.url;
                                                                                    const _errs13 = errors;
                                                                                    if (errors === _errs13) {
                                                                                        if (typeof data6 === "string") {
                                                                                            if (!pattern0.test(data6)) {
                                                                                                validateSchema.errors = [{
                                                                                                    instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist/" + i1 + "/url",
                                                                                                    schemaPath: "#/properties/groupedtabs/items/properties/tablist/items/properties/url/pattern",
                                                                                                    keyword: "pattern",
                                                                                                    params: {
                                                                                                        pattern: "^(.*)$"
                                                                                                    },
                                                                                                    message: "must match pattern \"" + "^(.*)$" + "\""
                                                                                                }];
                                                                                                return false;
                                                                                            }
                                                                                        } else {
                                                                                            validateSchema.errors = [{
                                                                                                instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist/" + i1 + "/url",
                                                                                                schemaPath: "#/properties/groupedtabs/items/properties/tablist/items/properties/url/type",
                                                                                                keyword: "type",
                                                                                                params: {
                                                                                                    type: "string"
                                                                                                },
                                                                                                message: "must be string"
                                                                                            }];
                                                                                            return false;
                                                                                        }
                                                                                    }
                                                                                    var valid4 = _errs13 === errors;
                                                                                } else {
                                                                                    var valid4 = true;
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        validateSchema.errors = [{
                                                                            instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist/" + i1,
                                                                            schemaPath: "#/properties/groupedtabs/items/properties/tablist/items/type",
                                                                            keyword: "type",
                                                                            params: {
                                                                                type: "object"
                                                                            },
                                                                            message: "must be object"
                                                                        }];
                                                                        return false;
                                                                    }
                                                                }
                                                                var valid3 = _errs9 === errors;
                                                                if (!valid3) {
                                                                    break;
                                                                }
                                                            }
                                                        } else {
                                                            validateSchema.errors = [{
                                                                instancePath: instancePath + "/groupedtabs/" + i0 + "/tablist",
                                                                schemaPath: "#/properties/groupedtabs/items/properties/tablist/type",
                                                                keyword: "type",
                                                                params: {
                                                                    type: "array"
                                                                },
                                                                message: "must be array"
                                                            }];
                                                            return false;
                                                        }
                                                    }
                                                    var valid2 = _errs7 === errors;
                                                } else {
                                                    var valid2 = true;
                                                }
                                            }
                                        }
                                    } else {
                                        validateSchema.errors = [{
                                            instancePath: instancePath + "/groupedtabs/" + i0,
                                            schemaPath: "#/properties/groupedtabs/items/type",
                                            keyword: "type",
                                            params: {
                                                type: "object"
                                            },
                                            message: "must be object"
                                        }];
                                        return false;
                                    }
                                }
                                var valid1 = _errs3 === errors;
                                if (!valid1) {
                                    break;
                                }
                            }
                        } else {
                            validateSchema.errors = [{
                                instancePath: instancePath + "/groupedtabs",
                                schemaPath: "#/properties/groupedtabs/type",
                                keyword: "type",
                                params: {
                                    type: "array"
                                },
                                message: "must be array"
                            }];
                            return false;
                        }
                    }
                }
            }
        } else {
            validateSchema.errors = [{
                instancePath,
                schemaPath: "#/type",
                keyword: "type",
                params: {
                    type: "object"
                },
                message: "must be object"
            }];
            return false;
        }
    }
    validateSchema.errors = vErrors;
    return errors === 0;
}