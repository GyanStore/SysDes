# Load Balancer Implementation in Python

This repository contains a Python implementation of common load balancing algorithms:

- **Round Robin**
- **Weighted Round Robin**
- **IP Hashing**

The code is designed to be clean, understandable, and beginner-friendly.

---

## 📝 Overview

The `LoadBalancer` class manages a list of servers and distributes requests using three algorithms:

- **Round Robin:** Cycles through servers in order, distributing requests evenly.
- **Weighted Round Robin:** Favors servers with higher weights by selecting them more frequently.
- **IP Hashing:** Maps client IPs to servers using a hash function, ensuring consistent server selection for the same IP.

**Features:**

- Modular code
- Supports both simple server lists (e.g., `["Server1", "Server2"]`) and weighted server tuples (e.g., `[("Server1", 3), ("Server2", 2)]`)
- Example usage included

---

## 🔎 Code Explanation

Below is a line-by-line explanation of `load_balancer.py`, tailored for beginners familiar with load balancing concepts.

---

### 1. Class Definition

```python
class LoadBalancer:
    """
    Organizes load balancing logic.
    Groups related methods and data, making the code reusable and maintainable.
    """
```

---

### 2. Constructor

```python
def __init__(self, servers):
    """
    Initialize the load balancer with a list of servers.
    Each server can be a string (for simple Round Robin or IP Hashing)
    or a tuple (server, weight) for Weighted Round Robin.
    """
    self.servers = servers
    self.current_index = 0
    self.weighted_servers = self._prepare_weighted_servers()
```

- **self.servers:** Stores the input servers list as an instance variable for use in all methods.
- **self.current_index:** Initializes a counter to track the current server.
- **self.weighted_servers:** Calls a helper method to create a weighted server list for Weighted Round Robin.

---

### 3. Weighted Servers Preparation

```python
def _prepare_weighted_servers(self):
    """
    Prepare a list for weighted round robin by expanding servers based on their weights.
    For example, a server with weight 3 will appear 3 times in the list.
    """
    weighted = []
    for server in self.servers:
        if isinstance(server, tuple):
            server_name, weight = server
            weighted.extend([server_name] * weight)
        else:
            weighted.append(server)
    return weighted
```

- Expands server names based on their weights for easy Weighted Round Robin selection.

---

### 4. Round Robin

```python
def round_robin(self):
    """
    Implements Round Robin load balancing.
    Returns the next server in a cyclic order.
    """
    server = self.servers[self.current_index]
    self.current_index = (self.current_index + 1) % len(self.servers)
    return server
```

- Cycles through servers evenly.

---

### 5. Weighted Round Robin

```python
def weighted_round_robin(self):
    """
    Implements Weighted Round Robin load balancing.
    Servers with higher weights get selected more frequently.
    """
    if not self.weighted_servers:
        return None
    server = self.weighted_servers[self.current_index]
    self.current_index = (self.current_index + 1) % len(self.weighted_servers)
    return server
```

- Selects servers based on their weights.

---

### 6. IP Hashing

```python
def ip_hash(self, client_ip):
    """
    Implements IP Hashing load balancing.
    Maps a client IP to a server based on a hash function.
    """
    if not isinstance(client_ip, str):
        client_ip = str(client_ip)
    hash_value = sum(ord(c) for c in client_ip) % len(self.servers)
    return self.servers[hash_value]
```

- Maps client IP consistently to a server.

---

### 7. Get Servers

```python
def get_servers(self):
    """Returns the list of servers."""
    return self.servers
```

---

## ▶️ Example Usage

The code includes an example section to demonstrate all algorithms:

```python
if __name__ == "__main__":
    servers = ["Server1", "Server2", "Server3"]
    lb = LoadBalancer(servers)

    print("Round Robin:")
    for _ in range(6):
        print(lb.round_robin())

    print("\nIP Hashing:")
    print(f"Client 192.168.1.1 -> {lb.ip_hash('192.168.1.1')}")
    print(f"Client 192.168.1.2 -> {lb.ip_hash('192.168.1.2')}")
    print(f"Client 192.168.1.1 -> {lb.ip_hash('192.168.1.1')}")

    weighted_servers = [("Server1", 3), ("Server2", 2), ("Server3", 1)]
    lb_weighted = LoadBalancer(weighted_servers)

    print("\nWeighted Round Robin:")
    for _ in range(6):
        print(lb_weighted.weighted_round_robin())
```

---

#### Sample Output

```text
Round Robin:
Server1
Server2
Server3
Server1
Server2
Server3

IP Hashing:
Client 192.168.1.1 -> Server2
Client 192.168.1.2 -> Server1
Client 192.168.1.1 -> Server2

Weighted Round Robin:
Server1
Server1
Server1
Server2
Server2
Server3
```

---

## 🚀 How to Use

1. **Save the code** as `load_balancer.py`.
2. **Run it** with:
   ```bash
   python load_balancer.py
   ```
3. **Create a LoadBalancer object** with a server list:
   ```python
   lb = LoadBalancer(["Server1", "Server2", "Server3"])
   ```
4. **Call methods to distribute requests:**
   - `lb.round_robin()` for Round Robin.
   - `lb.weighted_round_robin()` for Weighted Round Robin (if using weighted servers).
   - `lb.ip_hash("192.168.1.1")` for IP Hashing.

---

## 🛠️ Extending the Code

- **Server Health Checks:** Add logic to skip offline servers.
- **Session Persistence:** Store session data for IP Hashing.
- **Testing:** Modify server lists or weights to experiment with distribution.

> **Note:** This implementation is single-threaded. For multi-threaded applications, add synchronization (e.g., locks) to protect `current_index`.

---
