var fs = require('fs');
var path = require('path');
const YAML = require('yaml')


var npyio = require('nypio-ts');


export function create_group(path_root: string, name: string) : string{
    // Make the folder
    let to_create: string = path.join(path_root, name);
    fs.mkdirSync(to_create, function(err){
        if(err) throw err;
        console.log(`Made folder ${to_create}`);
    });

    // Write the YAML metadata
    let group_metadata = {exdir: {type: 'group', version: 1}};  // TODO: types
    let content: string = YAML.stringify(group_metadata);
    let filepath: string = path.join(to_create, 'exdir.yaml');
    fs.writeFileSync(filepath, content, function(err){
        if(err) throw err;
        console.log(`Wrote 'exdir.yaml' for group ${name}`);
    })

    return to_create;
}

export function create_file(folderpath: string): string {
    fs.mkdirSync(folderpath, function(err) {
        if (err) throw err;
        console.log(`Created folder ${folderpath}`);
    });

    // Write the YAML metadata
    let file_metadata = {exdir: {type: 'file', version: 1}}; // TODO: types
    let content: string = YAML.stringify(file_metadata);
    let filepath: string = path.join(folderpath, 'exdir.yaml');
    fs.writeFileSync(filepath, content, function(err){
        if(err) throw err;
        console.log(`Wrote 'exdir.yaml' for file ${folderpath}`);
    });

    return folderpath;
}

export function write_attributes(root: string, attributes){  // TODO: Types
    let filepath: string = path.join(root, 'attributes.yaml');
    let content: string = YAML.stringify(attributes);
    fs.writeFileSync(filepath, content, function(err){
        if(err) throw err;
        console.log(`Wrote 'attributes.yaml' for parent ${root}`);
    });
}

export function write_dataset(root: string, key: string, data: Buffer, header: string): string {  // TODO: Types
    // Make the folder
    let to_create: string = path.join(root, key);
    fs.mkdirSync(to_create, function(err){
        if(err) throw err;
        console.log(`Made folder ${to_create}`);
    });

    // Write the YAML metadata
    let dset_metadata = {exdir: {type: 'dataset', version: 1}};  // TODO: types
    let content: string = YAML.stringify(dset_metadata);
    let filepath: string = path.join(to_create, 'exdir.yaml');
    fs.writeFileSync(filepath, content, function(err){
        if(err) throw err;
        console.log(`Wrote 'exdir.yaml' for dataset ${key}`);
    })

    let filepath_data: string = path.join(to_create, 'data.npy');
    npyio.write_npy(filepath_data, data, header);

    return to_create;

}








export function read_exdir_metadata(dir: string): string {
    // Read the metadata, return the exdir type
    let fileContents = fs.readFileSync(path.join(dir, 'exdir.yaml'), 'utf8');
    console.log(`${dir} has metadata ${fileContents}`);
    let metadata = YAML.parse(fileContents);
    return metadata.exdir.type;
}

export function open_group(root: string, group: string): string {
    let group_path = path.join(root, group);
    if( read_exdir_metadata(group_path) != 'group') {
        // TODO: Throw error
        console.log(`${root} NOT A GROUP`);
    }
    return group_path;
}

export function read_attributes(root: string) {  // TODO: Types

    let filepath: string = path.join(root, 'attributes.yaml');
    // Read in the YAML attributes
    let fileContents = fs.readFileSync(filepath, 'utf8');
    return YAML.parse(fileContents);
}

export function open_dataset(root: string, name: string): string {
    let dset_path: string = path.join(root, name);
    if( read_exdir_metadata(dset_path) != 'dataset' ){
        // TODO: Throw error here
        console.log(`${root} NOT A DATASET`);
    }
    return dset_path;
}






export function read_dataset(dset_path: string) {
    let filepath: string = path.join(dset_path, 'data.npy');

    return npyio.read_npy(filepath);

}

