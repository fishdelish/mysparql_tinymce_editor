
require.paths.unshift('spec', '/Users/davidworkman/.rvm/gems/ruby-1.9.2-p0@global/gems/jspec-4.3.3/lib', 'lib')
require('jspec')
require('unit/spec.helper')
require('mysparql/editor_plugin')

JSpec
  .exec('spec/unit/spec.editor_plugin.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()
