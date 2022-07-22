/// <reference types="node" />
export declare function create_group(path_root: string, name: string): string;
export declare function create_file(folderpath: string): string;
export declare function write_attributes(root: string, attributes: any): void;
export declare function write_dataset(root: string, key: string, data: Buffer, header: string): string;
export declare function read_exdir_metadata(dir: string): string;
export declare function open_group(root: string, group: string): string;
export declare function read_attributes(root: string): any;
export declare function open_dataset(root: string, name: string): string;
export declare function read_dataset(dset_path: string): any[];
