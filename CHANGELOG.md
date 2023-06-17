# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- N/A

## [v2.1.0] - 2023-06-17

### Added

- [#12] Ability to produce Roman numerals.

## [v2.0.1] - 2022-09-26

### Fixed

- Default tolerance documentation was incorrect.

## [v2.0.0] - 2022-09-15

### Changed

- `defaultTolerance` is now `0.0075`.

### Added

- Support for sixteenths.

## [v1.1.0] - 2022-04-08

### Fixed

- Handles values greater than -1 and less than zero correctly.

### Added

- New `tolerance` and `fractionSlash` options.
- Handle more fractions.

## [v1.0.2] - 2022-04-16

### Added

- Build with [Vite](https://vitejs.dev/).

## [v1.0.1] - 2021-02-15

### Added

- Description to [package.json](./package.json).

## [v1.0.0] - 2021-02-11

### Added

- Build with ([tsdx](https://tsdx.io/)).

### Fixed

- UMD build.

## [v0.6.1] - 2021-02-08

### Fixed

- Updated [README.md](./README.md).

## [v0.6.0] - 2019-08-31

### Added

- Ability to produce unicode vulgar fractions (pass `true` as the second argument).

## [v0.5.0] - 2019-08-24

### Changed

- Invalid inputs now return `null` instead of `"-1"`.

### Fixed

- Handles negative numbers properly.

## [v0.4.2] - 2019-08-23

### Fixed

- Only publish `dist` directory.

## [v0.4.1] - 2019-08-23

### Changed

- Removed bower.json.

### Added

- Rewritten with TypeScript.

### Fixed

- ...

## [v0.4.0] - 2019-08-22

### Added

- CJS/ESM/UMD builds.

## [v0.3.4] - 2019-07-21

### Fixed

- Updated [README.md](./README.md).

## [v0.3.3] - 2019-07-20

### Added

- JSDoc comments.

### Fixed

- Parameter type.

## [v0.3.2] - 2018-09-21

### Added

- TypeScript definitions.

## [v0.3.1] - 2015-07-16

### Fixed

- Updated [README.md](./README.md).

## [v0.3.0] - 2015-07-16

### Added

- Bower & AMD support.

## [v0.1.0] - 2015-03-18

### Added

- Initial release

<!-- Issue/PR links -->

[#12]: https://github.com/jakeboone02/format-quantity/pull/12

<!-- Release comparison links -->

[unreleased]: https://github.com/jakeboone02/numeric-quantity/compare/v2.1.0...HEAD
[v2.1.0]: https://github.com/jakeboone02/format-quantity/compare/v2.0.1...v2.1.0
[v2.0.1]: https://github.com/jakeboone02/format-quantity/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/jakeboone02/format-quantity/compare/v1.1.0...v2.0.0
[v1.1.0]: https://github.com/jakeboone02/format-quantity/compare/v1.0.2...v1.1.0
[v1.0.2]: https://github.com/jakeboone02/format-quantity/compare/v1.0.1...v1.0.2
[v1.0.1]: https://github.com/jakeboone02/format-quantity/compare/v1.0.0...v1.0.1
[v1.0.0]: https://github.com/jakeboone02/format-quantity/compare/v0.6.1...v1.0.0
[v0.6.1]: https://github.com/jakeboone02/format-quantity/compare/v0.6.0...v0.6.1
[v0.6.0]: https://github.com/jakeboone02/format-quantity/compare/v0.5.0...v0.6.0
[v0.5.0]: https://github.com/jakeboone02/format-quantity/compare/v0.4.2...v0.5.0
[v0.4.2]: https://github.com/jakeboone02/format-quantity/compare/v0.4.1...v0.4.2
[v0.4.1]: https://github.com/jakeboone02/format-quantity/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/jakeboone02/format-quantity/compare/v0.3.4...v0.4.0
[v0.3.4]: https://github.com/jakeboone02/format-quantity/compare/v0.3.3...v0.3.4
[v0.3.3]: https://github.com/jakeboone02/format-quantity/compare/v0.3.2...v0.3.3
[v0.3.2]: https://github.com/jakeboone02/format-quantity/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/jakeboone02/format-quantity/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/jakeboone02/format-quantity/compare/v0.1.0...v0.3.0
[v0.1.0]: https://github.com/jakeboone02/format-quantity/tree/v0.1.0
