module.exports = {
  DocumentDirectoryPath: '/tmp',
  ExternalDirectoryPath: '/tmp',
  ExternalStorageDirectoryPath: '/tmp',
  writeFile: jest.fn(async () => true),
  exists: jest.fn(async () => false),
  readFile: jest.fn(async () => ''),
  unlink: jest.fn(async () => true),
};
