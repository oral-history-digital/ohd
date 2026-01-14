ActiveStorage::ClamAV::Analyzer.on_detection = -> (blob) { blob.destroy }
