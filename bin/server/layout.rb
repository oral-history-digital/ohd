#!/usr/bin/env ruby
# frozen_string_literal: true

# Renders the Kamal config for one destination the way Kamal does (ERB, then a
# deep merge of config/deploy.yml and config/deploy.<destination>.yml) and prints
# the host layout that bin/server/bootstrap needs:
#
#   SSH_USER <user>
#   HOST <ip>                    every host used by a role or an accessory
#   DIR <path> <container uid>   host directory of a volume or accessory directory.
#                                Relative paths are relative to the remote home
#                                (that is how Kamal resolves accessory directories).
#
# Usage: ruby bin/server/layout.rb <destination>   (run from the project root)

require "erb"
require "yaml"

# Users the images run as. Keep in sync with Dockerfile (appuser) and the
# official mariadb / solr images.
CONTAINER_UIDS = {
  "/var/lib/mysql" => 999,  # mariadb
  "/opt/solr"      => 8983, # solr
  "/app"           => 1000  # appuser (Dockerfile)
}.freeze

def load_config(path)
  return {} unless File.exist?(path)

  YAML.safe_load(ERB.new(File.read(path)).result(binding), aliases: true) || {}
end

def deep_merge(base, override)
  base.merge(override) do |_key, a, b|
    a.is_a?(Hash) && b.is_a?(Hash) ? deep_merge(a, b) : b
  end
end

def container_uid(path)
  CONTAINER_UIDS.find { |prefix, _| path == prefix || path.start_with?("#{prefix}/") }&.last
end

def emit_dir(host_path, container_path)
  uid = container_uid(container_path.to_s)
  warn "WARNING: no known container uid for #{container_path}; #{host_path} is created, not chowned" if uid.nil?
  puts "DIR #{host_path} #{uid || '-'}"
end

destination = ARGV.fetch(0) { abort "usage: ruby bin/server/layout.rb <destination>" }

cfg = deep_merge(load_config("config/deploy.yml"), load_config("config/deploy.#{destination}.yml"))
service = cfg.fetch("service")
ssh_user = cfg.dig("ssh", "user") or abort "ssh.user must be set in config/deploy.#{destination}.yml"

servers = cfg["servers"] || {}
servers = { "web" => servers } if servers.is_a?(Array)
accessories = cfg["accessories"] || {}

hosts = []
servers.each_value { |role| hosts.concat(role.is_a?(Hash) ? Array(role["hosts"]) : Array(role)) }
accessories.each_value { |acc| hosts.concat(Array(acc["hosts"])) }
hosts = hosts.map(&:to_s).uniq
abort "no hosts found for destination #{destination}" if hosts.empty?

puts "SSH_USER #{ssh_user}"
hosts.each { |host| puts "HOST #{host}" }

Array(cfg["volumes"]).each do |volume|
  host_path, container_path = volume.split(":")
  emit_dir(host_path, container_path)
end

accessories.each do |name, acc|
  accessory_service = acc["service"] || "#{service}-#{name}"
  Array(acc["directories"]).each do |dir|
    host_path, container_path = dir.split(":")
    host_path = File.join(accessory_service, host_path) unless host_path.start_with?("/")
    emit_dir(host_path, container_path)
  end
end
