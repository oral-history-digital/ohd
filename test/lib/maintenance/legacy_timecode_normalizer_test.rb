require 'test_helper'
require Rails.root.join('lib/maintenance/legacy_timecode_normalizer').to_s

# Covers strict legacy-format normalization independently of permissive parsing.
class LegacyTimecodeNormalizerTest < ActiveSupport::TestCase
  test 'normalizes known formats with exact integer frame conversion' do
    {
      '00:01:02.003' => '00:01:02.003',
      '00:01:02,003' => '00:01:02.003',
      '00:01:02:003' => '00:01:02.003',
      '00:01:02.1239' => '00:01:02.123',
      '00:01:02,0019' => '00:01:02.001',
      '00:01:02:9999' => '00:01:02.999',
      '00:01:02' => '00:01:02.000',
      '000:001:02' => '00:01:02.000',
      '0:01:02.003' => '00:01:02.003',
      ' 00:01:02.003 ' => '00:01:02.003',
      '[12] 00:01:02.003' => '00:01:02.003',
      '<00:01:02.003>' => '00:01:02.003',
      ' < [2] 0:01:02,003 > ' => '00:01:02.003',
      '00:00:01:12' => '00:00:01.480',
      '00:00:01.12' => '00:00:01.480',
      '00:00:01,12' => '00:00:01.480',
      '00:00:00,00' => '00:00:00.000',
      '00:00:021,19' => '00:00:21.760',
      '00:00:01,24' => '00:00:01.960',
      '00:00:00:00' => '00:00:00.000',
      '99:59:59.24' => '99:59:59.960',
      '99:59:59.999' => '99:59:59.999',
      '100:00:00.000' => '100:00:00.000',
      '9999:59:59.999' => '9999:59:59.999',
      '0344:00:00.000' => '344:00:00.000',
      '000:00:01.000' => '00:00:01.000',
      '00:00:021.190' => '00:00:21.190',
      '00:00:021.19' => '00:00:21.760',
      '000:001:021:19' => '00:01:21.760',
      '000:000:000.000' => '00:00:00.000',
      '00:059:059,999' => '00:59:59.999',
      '0:1:2' => '00:01:02.000',
      '00:01:02.1000' => '00:01:02.100',
      '00:001:02.1000' => '00:01:02.100'
    }.each do |input, expected|
      input.freeze
      assert_equal expected, Maintenance::LegacyTimecodeNormalizer.normalize(input), input
      assert_equal expected, Maintenance::LegacyTimecodeNormalizer.normalize(expected), "Repeat: #{input}"
    end
  end

  test 'rejects unknown ambiguous and invalid values without guessing' do
    [nil, '', ' ', 'unknown', '00:60:00.000', '00:00:60.000',
     '00:00:01:25', '00:00:01.99', '00:00:01,25', '00:00:01,99', '00:00:01.1',
     '00:00:01.12345', '00:00:01:12345', '00:00:01x123',
     '00:0344:00.000', '00:00:0344.000', '00:060:00.000', '00:00:060.000',
     '-1:00:01.000', '00:00:0-.000',
     '<00:00:01.000', '00:<00>:01.000', "00:00:01.000\nunknown"].each do |input|
      assert_raises(ArgumentError, input.inspect) { Maintenance::LegacyTimecodeNormalizer.normalize(input) }
    end
  end
end
