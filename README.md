Load Balancer Implementation in Python

This repository contains a Python implementation of common load balancing algorithms: Round Robin, Weighted Round Robin, and IP Hashing. The code is designed to be clean, understandable, and beginner-friendly for those who know load balancing theory but need help with implementation.
Overview
The LoadBalancer class manages a list of servers and distributes requests using three algorithms:

Round Robin: Cycles through servers in order, distributing requests evenly.
Weighted Round Robin: Favors servers with higher weights by selecting them more frequently.
IP Hashing: Maps client IPs to servers using a hash function, ensuring consistent server selection for the same IP.

The code is modular, supports both simple server lists (e.g., ["Server1", "Server2"]) and weighted server tuples (e.g., [("Server1", 3), ("Server2", 2)]), and includes example usage.
Code Explanation
Below is a line-by-line explanation of load_balancer.py, tailored for beginners familiar with load balancing concepts.
Class Definition
class LoadBalancer:


Defines a Python class LoadBalancer to organize load balancing logic.
Groups related methods and data, making the code reusable and maintainable.

Constructor
def __init__(self, servers):


The constructor, called when creating a LoadBalancer object with a list of servers.
Takes a servers parameter (list of server names or tuples with weights).

"""
Initialize the load balancer with a list of servers.
Each server can be a string (for simple Round Robin or IP Hashing)
or a tuple (server, weight) for Weighted Round Robin.
"""


A docstring explaining that servers can be strings (e.g., "Server1") or tuples (e.g., ("Server1", 3)) for different algorithms.

self.servers = servers


Stores the input servers list as an instance variable for use in all methods.
self refers to the current LoadBalancer object.

self.current_index = 0


Initializes a counter to track the current server for Round Robin and Weighted Round Robin.
Used to cycle through servers in order.

self.weighted_servers = self._prepare_weighted_servers()


Calls a helper method to create a weighted server list and stores it.
Prepares servers for Weighted Round Robin by expanding them based on weights.

Weighted Servers Preparation
def _prepare_weighted_servers(self):


A helper method to create the weighted server list for Weighted Round Robin.
The underscore indicates it’s internal, not for direct use.

"""
Prepare a list for weighted round robin by expanding servers based on their weights.
For example, a server with weight 3 will appear 3 times in the list.
"""


Docstring explaining that servers are repeated in the list based on their weights.

weighted = []


Creates an empty list to store the expanded server list.

for server in self.servers:


Loops through each server in the self.servers list to process it.

if isinstance(server, tuple):


Checks if the server is a tuple (e.g., ("Server1", 3)) for Weighted Round Robin.

server_name, weight = server


Unpacks the tuple into server_name (e.g., "Server1") and weight (e.g., 3).

weighted.extend([server_name] * weight)


Adds server_name to the weighted list weight times (e.g., ["Server1", "Server1", "Server1"] for weight 3).
Ensures higher-weighted servers appear more often.

else:
    weighted.append(server)


If the server is a string (not a tuple), adds it to the list once.
Supports simple server lists for non-weighted algorithms.

return weighted


Returns the expanded list for Weighted Round Robin.

Round Robin
def round_robin(self):


Defines the Round Robin method to select the next server.

"""
Implements Round Robin load balancing.
Returns the next server in a cyclic order.
"""


Docstring explaining that it cycles through servers evenly.

server = self.servers[self.current_index]


Gets the server at the current index from self.servers.

self.current_index = (self.current_index + 1) % len(self.servers)


Increments the index and uses modulo (%) to wrap around to 0 at the end.
Ensures cyclic selection (e.g., after the last server, it picks the first).

return server


Returns the selected server for the request.

Weighted Round Robin
def weighted_round_robin(self):


Defines the Weighted Round Robin method.

"""
Implements Weighted Round Robin load balancing.
Servers with higher weights get selected more frequently.
"""


Docstring explaining that higher-weighted servers get more requests.

if not self.weighted_servers:
    return None


Returns None if the weighted server list is empty to avoid errors.

server = self.weighted_servers[self.current_index]


Gets the server at the current index from the weighted list.

self.current_index = (self.current_index + 1) % len(self.weighted_servers)


Increments the index and wraps around for cycling.

return server


Returns the selected server.

IP Hashing
def ip_hash(self, client_ip):


Defines the IP Hashing method, taking a client_ip parameter.

"""
Implements IP Hashing load balancing.
Maps a client IP to a server based on a hash function.
"""


Docstring explaining that it maps IPs to servers consistently.

if not isinstance(client_ip, str):
    client_ip = str(client_ip)


Converts client_ip to a string if it’s not (e.g., if it’s an integer).

hash_value = sum(ord(c) for c in client_ip) % len(self.servers)


Creates a hash by summing ASCII values of the IP’s characters and maps it to a server index using modulo.
Ensures the same IP always picks the same server.

return self.servers[hash_value]


Returns the server at the hashed index.

Get Servers
def get_servers(self):


Defines a method to return the server list.

"""Returns the list of servers."""
return self.servers


Returns the original server list for inspection.

Example Usage
The code includes an example section to demonstrate all algorithms:
if __name__ == "__main__":


Ensures the example runs only when the script is executed directly.

servers = ["Server1", "Server2", "Server3"]
lb = LoadBalancer(servers)


Creates a simple server list and a LoadBalancer object.

print("Round Robin:")
for _ in range(6):
    print(lb.round_robin())


Shows Round Robin cycling through servers (e.g., Server1, Server2, Server3, Server1, ...).

print("\nIP Hashing:")
print(f"Client 192.168.1.1 -> {lb.ip_hash('192.168.1.1')}")
print(f"Client 192.168.1.2 -> {lb.ip_hash('192.168.1.2')}")
print(f"Client 192.168.1.1 -> {lb.ip_hash('192.168.1.1')}")


Demonstrates IP Hashing, where the same IP maps to the same server.

weighted_servers = [("Server1", 3), ("Server2", 2), ("Server3", 1)]
lb_weighted = LoadBalancer(weighted_servers)


Sets up a weighted server list for Weighted Round Robin.

print("\nWeighted Round Robin:")
for _ in range(6):
    print(lb_weighted.weighted_round_robin())


Shows Weighted Round Robin, where Server1 appears more often due to its higher weight.

How to Use

Save the code as load_balancer.py.
Run it with python load_balancer.py to see the example output.
Create a LoadBalancer object with a server list:lb = LoadBalancer(["Server1", "Server2", "Server3"])


Call methods to distribute requests:
lb.round_robin() for Round Robin.
lb.weighted_round_robin() for Weighted Round Robin (if using weighted servers).
lb.ip_hash("192.168.1.1") for IP Hashing.



Extending the Code

Server Health Checks: Add logic to skip offline servers.
Session Persistence: Store session data for IP Hashing.
Testing: Modify server lists or weights to experiment with distribution.

This implementation is single-threaded. For multi-threaded applications, add synchronization (e.g., locks) to protect current_index.
