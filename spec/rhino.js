
load('/Users/davidworkman/.rvm/gems/ruby-1.9.2-p0@global/gems/jspec-4.3.3/lib/jspec.js')
load('/Users/davidworkman/.rvm/gems/ruby-1.9.2-p0@global/gems/jspec-4.3.3/lib/jspec.xhr.js')
load('lib/mysparql/editor_plugin.js')
load('spec/unit/spec.helper.js')

JSpec
.exec('spec/unit/spec.js')
.run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures' })
.report()
