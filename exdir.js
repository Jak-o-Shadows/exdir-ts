"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read_dataset = exports.open_dataset = exports.read_attributes = exports.open_group = exports.read_exdir_metadata = exports.write_dataset = exports.write_attributes = exports.create_file = exports.create_group = void 0;
var fs = require('fs');
var path = require('path');
const YAML = require('yaml');
const npyio = __importStar(require("../npyio-ts/npyio"));
function create_group(path_root, name) {
    // Make the folder
    let to_create = path.join(path_root, name);
    fs.mkdirSync(to_create, function (err) {
        if (err)
            throw err;
        console.log(`Made folder ${to_create}`);
    });
    // Write the YAML metadata
    let group_metadata = { exdir: { type: 'group', version: 1 } }; // TODO: types
    let content = YAML.stringify(group_metadata);
    let filepath = path.join(to_create, 'exdir.yaml');
    fs.writeFileSync(filepath, content, function (err) {
        if (err)
            throw err;
        console.log(`Wrote 'exdir.yaml' for group ${name}`);
    });
    return to_create;
}
exports.create_group = create_group;
function create_file(folderpath) {
    fs.mkdirSync(folderpath, function (err) {
        if (err)
            throw err;
        console.log(`Created folder ${folderpath}`);
    });
    // Write the YAML metadata
    let file_metadata = { exdir: { type: 'file', version: 1 } }; // TODO: types
    let content = YAML.stringify(file_metadata);
    let filepath = path.join(folderpath, 'exdir.yaml');
    fs.writeFileSync(filepath, content, function (err) {
        if (err)
            throw err;
        console.log(`Wrote 'exdir.yaml' for file ${folderpath}`);
    });
    return folderpath;
}
exports.create_file = create_file;
function write_attributes(root, attributes) {
    let filepath = path.join(root, 'attributes.yaml');
    let content = YAML.stringify(attributes);
    fs.writeFileSync(filepath, content, function (err) {
        if (err)
            throw err;
        console.log(`Wrote 'attributes.yaml' for parent ${root}`);
    });
}
exports.write_attributes = write_attributes;
function write_dataset(root, key, data, header) {
    // Make the folder
    let to_create = path.join(root, key);
    fs.mkdirSync(to_create, function (err) {
        if (err)
            throw err;
        console.log(`Made folder ${to_create}`);
    });
    // Write the YAML metadata
    let dset_metadata = { exdir: { type: 'dataset', version: 1 } }; // TODO: types
    let content = YAML.stringify(dset_metadata);
    let filepath = path.join(to_create, 'exdir.yaml');
    fs.writeFileSync(filepath, content, function (err) {
        if (err)
            throw err;
        console.log(`Wrote 'exdir.yaml' for dataset ${key}`);
    });
    let filepath_data = path.join(to_create, 'data.npy');
    npyio.write_npy(filepath_data, data, header);
    return to_create;
}
exports.write_dataset = write_dataset;
function read_exdir_metadata(dir) {
    // Read the metadata, return the exdir type
    let fileContents = fs.readFileSync(path.join(dir, 'exdir.yaml'), 'utf8');
    console.log(`${dir} has metadata ${fileContents}`);
    let metadata = YAML.parse(fileContents);
    return metadata.exdir.type;
}
exports.read_exdir_metadata = read_exdir_metadata;
function open_group(root, group) {
    let group_path = path.join(root, group);
    if (read_exdir_metadata(group_path) != 'group') {
        // TODO: Throw error
        console.log(`${root} NOT A GROUP`);
    }
    return group_path;
}
exports.open_group = open_group;
function read_attributes(root) {
    let filepath = path.join(root, 'attributes.yaml');
    // Read in the YAML attributes
    let fileContents = fs.readFileSync(filepath, 'utf8');
    return YAML.parse(fileContents);
}
exports.read_attributes = read_attributes;
function open_dataset(root, name) {
    let dset_path = path.join(root, name);
    if (read_exdir_metadata(dset_path) != 'dataset') {
        // TODO: Throw error here
        console.log(`${root} NOT A DATASET`);
    }
    return dset_path;
}
exports.open_dataset = open_dataset;
function read_dataset(dset_path) {
    let filepath = path.join(dset_path, 'data.npy');
    return npyio.read_npy(filepath);
}
exports.read_dataset = read_dataset;
