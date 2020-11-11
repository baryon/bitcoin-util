const test = require('tape')
const u = require('../')

test('toHash', function (t) {
  t.throws(function () { u.toHash('012345') }, 'throws for invalid hash length')
  t.throws(function () { u.toHash('') }, 'throws for empty string')
  const actual = u.toHash('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00')
  const expected = Buffer.from([
    0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255
  ])
  t.equal(actual.compare(expected), 0)
  t.end()
})

const targets = [
  {
    compact: 0x1d00ffff,
    expanded: '00000000ffff0000000000000000000000000000000000000000000000000000'
  },
  {
    compact: 0x04054321,
    expanded: '0000000000000000000000000000000000000000000000000000000005432100'
  },
  {
    compact: 0x04123456,
    expanded: '0000000000000000000000000000000000000000000000000000000012345600'
  },
  {
    compact: 0x05009234,
    expanded: '0000000000000000000000000000000000000000000000000000000092340000'
  },
  {
    compact: 0x20123456,
    expanded: '1234560000000000000000000000000000000000000000000000000000000000'
  },
  {
    compact: 0x1f70ffff,
    expanded: '0070ffff00000000000000000000000000000000000000000000000000000000'
  }
]
test('compressTarget', function (t) {
  t.test('compress targets', function (t) {
    targets.forEach(function (target) {
      const buf = Buffer.from(target.expanded, 'hex')
      t.equal(u.compressTarget(buf), target.compact, target)
    })
    t.end()
  })
  t.test('invalid type', function (t) {
    t.throws(function () {
      u.compressTarget(123)
    })
    t.end()
  })
  t.test('invalid length', function (t) {
    t.throws(function () {
      u.compressTarget(Buffer.from('test'))
    })
    t.end()
  })
  t.end()
})

test('expandTarget', function (t) {
  t.test('matches expected target', function (t) {
    targets.forEach(function (target) {
      t.equal(u.expandTarget(target.compact).toString('hex'), target.expanded, target)
    })
    t.end()
  })
  t.test('invalid length', function (t) {
    t.throws(function () {
      u.expandTarget(0xff00ff00ff)
    })
    t.end()
  })
  t.test('invalid exponent', function (t) {
    t.throws(function () {
      u.expandTarget(0x00ffffff)
    })
    t.throws(function () {
      u.expandTarget(0xffffffff)
    })
    t.end()
  })
  t.end()
})
