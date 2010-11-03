# sets the authorization logic library to use.

# 1. 'hardwired': direct association between users and roles
# 2. 'object roles': directly associated roles or roles associated via an object
# 3. 'items and groups': roles associated via both group and item
# 4. 'task and groups': roles associated via a task on an item or a group

AUTHORIZATION_MIXIN = "items and groups"