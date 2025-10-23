from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# ------------------------------------------    TP1     -------------------------------------


# ---------------- Graph orienté ----------------


graph = {}

# -------------------- Routes --------------------

@app.route("/graphOr/add_node", methods=["POST"])
def add_node():
    data = request.json
    node = data.get("node")
    if node not in graph:
        graph[node] = []
    return jsonify({"graph": graph})

@app.route("/graphOr/add_edge", methods=["POST"])
def add_edge():
    data = request.json
    src = data.get("src")
    dest = data.get("dest")

    if src not in graph:
        graph[src] = []
    if dest not in graph:
        graph[dest] = []

    # Ajout arête orientée
    graph[src].append(dest)
    return jsonify({"graph": graph})

@app.route("/graphOr/get", methods=["GET"])
def get_graph():
    return jsonify({"graph": graph})



# Graphe pondéré représenté par dict : {sommet: [(dest, poids), ...]}
graph = {}

# ---------------- ROUTES ---------------- #

@app.route("/graphpendere/add_node", methods=["POST"])
def add_node_pondere():
    data = request.json
    node = data.get("node")
    if node not in graph:
        graph[node] = []
    return jsonify({"graph": graph})

@app.route("/graphpendere/add_edge", methods=["POST"])
def add_edge_pondere():
    data = request.json
    src = data.get("src")
    dest = data.get("dest")
    weight = data.get("weight", 1)  # poids par défaut = 1

    if src not in graph:
        graph[src] = []
    if dest not in graph:
        graph[dest] = []

    # Ajout arête pondérée
    graph[src].append((dest, weight))
    return jsonify({"graph": graph})

@app.route("/graphpendere/get", methods=["GET"])
def get_graph_pondere():
    return jsonify({"graph": graph})
# Graphe non pondéré représenté par dict : {sommet: [dest1, dest2, ...]}
graph_nonpondere = {}

@app.route("/graphnonpondere/add_node", methods=["POST"])
def add_node_nonpondere():
    data = request.json
    node = data.get("node")
    if node not in graph_nonpondere:
        graph_nonpondere[node] = []
    return jsonify({"graph": graph_nonpondere})

@app.route("/graphnonpondere/add_edge", methods=["POST"])
def add_edge_nonpondere():
    data = request.json
    src = data.get("src")
    dest = data.get("dest")

    if src not in graph_nonpondere:
        graph_nonpondere[src] = []
    if dest not in graph_nonpondere:
        graph_nonpondere[dest] = []

    graph_nonpondere[src].append(dest)
    return jsonify({"graph": graph_nonpondere})

@app.route("/graphnonpondere/get", methods=["GET"])
def get_graph_nonpondere():
    return jsonify({"graph": graph_nonpondere})



graph = {}

# -------------------- Routes --------------------

#  Ajouter un sommet
@app.route("/graphNonOr/add_node", methods=["POST"])
def add_node_non_oriente():
    data = request.json
    node = data.get("node")
    if node not in graph:
        graph[node] = []
    return jsonify({"graph": graph})

#  Ajouter une arête (non orientée)
@app.route("/graphNonOr/add_edge", methods=["POST"])
def add_edge_non_oriente():
    data = request.json
    src = data.get("src")
    dest = data.get("dest")

    if src not in graph:
        graph[src] = []
    if dest not in graph:
        graph[dest] = []

    # Ajouter l'arête dans les deux sens
    if dest not in graph[src]:
        graph[src].append(dest)
    if src not in graph[dest]:
        graph[dest].append(src)

    return jsonify({"graph": graph})

#  Obtenir le graphe complet
@app.route("/graphNonOr/get", methods=["GET"])
def get_graph_non_oriente():
    return jsonify({"graph": graph})

#  Nombre de sommets
@app.route("/graphNonOr/count_nodes", methods=["GET"])
def count_nodes_non_oriente():
    return jsonify({"count_nodes": len(graph)})

#  Nombre d’arêtes
@app.route("/graphNonOr/count_edges", methods=["GET"])
def count_edges_non_oriente():
    count = sum(len(v) for v in graph.values()) // 2
    return jsonify({"count_edges": count})


# ----------------------------------------------------- TP2  ----------------------------------------

# -------------------- ABR --------------------
class NodeABR:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

root_abr = None # the tree is empty

def insert_abr(node, value):
    if node is None:
        return NodeABR(value)
    if value < node.value:
        node.left = insert_abr(node.left, value)
    else:
        node.right = insert_abr(node.right, value)
    return node

def to_dict_abr(node): #Converts the ABR into a JSON-like dictionary (for React Tree visualization).
    if node is None:
        return None
    return {
        "name": str(node.value),
        "children": [c for c in [to_dict_abr(node.left), to_dict_abr(node.right)] if c]
    }

# --- ABR info functions ---
def tree_height_ABR(node):
    if node is None:
        return 0
    return 1 + max(tree_height_ABR(node.left), tree_height_ABR(node.right))

def node_count_ABR(node):
    if node is None:
        return 0
    return 1 + node_count_ABR(node.left) + node_count_ABR(node.right)

def max_degree_ABR(node):
    if node is None:
        return 0
    degree = 0
    if node.left: degree += 1
    if node.right: degree += 1
    return max(degree, max_degree_ABR(node.left), max_degree_ABR(node.right))

def density_ABR(node):
    h = tree_height_ABR(node)
    n = node_count_ABR(node)
    return n / h if h > 0 else 0

# ---  Search function ---
def search_abr(node, value):
    if node is None:
        return False
    if node.value == value:
        return True
    elif value < node.value:
        return search_abr(node.left, value)
    else:
        return search_abr(node.right, value)

# ---  Delete function ---
def min_value_node(node): # Finds the smallest value node (used when deleting a node with two children)
    current = node
    while current.left is not None:
        current = current.left
    return current

def delete_abr(node, value):
    if node is None:
        return node

    if value < node.value:
        node.left = delete_abr(node.left, value)
    
    # If the value to be deleted is greater than the node's value,
    # then it lies in the right subtree
    elif value > node.value:
        node.right = delete_abr(node.right, value)
    
    # If value is same as node's value, then this is the node to be deleted
    else:
        # Node with only one child or no child
        if node.left is None:
            temp = node.right
            node = None
            return temp
        elif node.right is None:
            temp = node.left
            node = None
            return temp

        # Node with two children: Get the inorder successor
        temp = min_value_node(node.right)

        # Copy the inorder successor's content to this node
        node.value = temp.value

        # Delete the inorder successor
        node.right = delete_abr(node.right, temp.value) # Then delete value from right subtree ..... removes original value node.

    return node

# --- Routes ---
@app.route('/upload', methods=['POST'])
def upload_file():
    global root_abr
    file = request.files['file'] # Receives uploaded file from frontend.
    content = file.read().decode('utf-8') # Reads and decodes it as text.

    #  Step 1: Remove all brackets and commas
    cleaned = content.replace('[', ' ').replace(']', ' ').replace(',', ' ')

    #  Step 2: Extract only numbers using regex
    import re
    all_numbers = re.findall(r'\d+', cleaned)
    all_numbers = [int(n) for n in all_numbers]

    #  Step 3: Skip every 3rd element (assuming pattern [[a,b][c]])
    filtered = []
    for i in range(len(all_numbers)):
        filtered.append(all_numbers[i])

    #  Step 4: Build ABR with filtered values
    root_abr = None
    for v in filtered:
        root_abr = insert_abr(root_abr, v)

    return jsonify({
        'message': 'File uploaded and ABR built successfully!',
        'values': filtered
    })

@app.route('/abr/insert', methods=['POST'])
def insert_value_abr():
    global root_abr
    value = request.json["value"]
    root_abr = insert_abr(root_abr, value)
    return jsonify(to_dict_abr(root_abr))

@app.route('/abr/reset', methods=['POST'])
def reset_tree_abr():
    global root_abr
    root_abr = None
    return jsonify({"message": "ABR reset!"})

@app.route('/abr/info', methods=['GET'])
def get_info_abr():
    global root_abr
    info = {
        "height": tree_height_ABR(root_abr),
        "degree": max_degree_ABR(root_abr),
        "density": density_ABR(root_abr),
    }
    return jsonify(info)

@app.route('/abr/show', methods=['GET'])
def show_abr():
    return jsonify(to_dict_abr(root_abr))

# ---  Delete route ---
@app.route('/abr/delete', methods=['POST'])
def delete_value_abr():
    global root_abr
    value = request.json["value"]
    
    # Check if value exists in the tree
    if not search_abr(root_abr, value):
        return jsonify({"message": f"Value {value} does not exist in the tree", "success": False})
    
    # Delete the value
    root_abr = delete_abr(root_abr, value)
    return jsonify({
        "message": f"Value {value} deleted successfully",
        "success": True,
        "tree": to_dict_abr(root_abr)
    })

@app.route('/abr/search', methods=['POST'])
def search_value_abr():
    global root_abr
    value = request.json["value"]
    exists = search_abr(root_abr, value)
    return jsonify({
        "value": value,
        "exists": exists,
        "message": f"Value {value} {'exists' if exists else 'does not exist'} in the tree"
    })





# -------------------- AVL --------------------
class NodeAVL:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1


root_avl = None


# --- Helper functions ---
def get_height(node):
    return 0 if node is None else node.height


def get_balance(node):
    return 0 if node is None else get_height(node.left) - get_height(node.right)


def rotate_right(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    return x


def rotate_left(x):
    y = x.right
    T2 = y.left
    y.left = x
    x.right = T2
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    return y


def get_min_value_node(node):
    current = node
    while current.left is not None:
        current = current.left
    return current


# --- AVL Insertion ---
def insert_avl(node, value):
    if node is None:
        return NodeAVL(value)
    if value < node.value:
        node.left = insert_avl(node.left, value)
    elif value > node.value:
        node.right = insert_avl(node.right, value)
    else:
        return node  # duplicates ignored

    node.height = 1 + max(get_height(node.left), get_height(node.right))
    balance = get_balance(node)

    # Balancing
    if balance > 1 and value < node.left.value:
        return rotate_right(node)
    if balance < -1 and value > node.right.value:
        return rotate_left(node)
    if balance > 1 and value > node.left.value:
        node.left = rotate_left(node.left)
        return rotate_right(node)
    if balance < -1 and value < node.right.value:
        node.right = rotate_right(node.right)
        return rotate_left(node)

    return node


# --- AVL Deletion ---
def delete_avl(node, value):
    global root_avl

    # Standard BST deletion
    if node is None:
        return node

    if value < node.value:
        node.left = delete_avl(node.left, value)
    elif value > node.value:
        node.right = delete_avl(node.right, value)
    else:
        # Node with only one child or no child
        if node.left is None:
            temp = node.right
            node = None
            return temp
        elif node.right is None:
            temp = node.left
            node = None
            return temp

        # Node with two children: get the inorder successor
        temp = get_min_value_node(node.right)
        node.value = temp.value
        node.right = delete_avl(node.right, temp.value)

    # If the tree had only one node then return
    if node is None:
        return node
    
    # Update height
    node.height = 1 + max(get_height(node.left), get_height(node.right))
    
    # Get balance factor
    balance = get_balance(node)
    
    # Balance the tree
    # Left Left Case
    if balance > 1 and get_balance(node.left) >= 0:
        return rotate_right(node)
    
    # Left Right Case
    if balance > 1 and get_balance(node.left) < 0:
        node.left = rotate_left(node.left)
        return rotate_right(node)
    
    # Right Right Case
    if balance < -1 and get_balance(node.right) <= 0:
        return rotate_left(node)
    
    # Right Left Case
    if balance < -1 and get_balance(node.right) > 0:
        node.right = rotate_right(node.right)
        return rotate_left(node)
    
    return node


# --- AVL Search ---
def search_avl(node, value):
    if node is None:
        return False
    
    if value == node.value:
        return True
    elif value < node.value:
        return search_avl(node.left, value)
    else:
        return search_avl(node.right, value)


# --- Convert AVL to dict ---
def to_dict_avl(node):
    if node is None:
        return None
    return {
        "name": str(node.value),
        "children": [child for child in [to_dict_avl(node.left), to_dict_avl(node.right)] if child]
    }


# --- AVL Info functions ---
def tree_height_AVL(node):
    return 0 if node is None else 1 + max(tree_height_AVL(node.left), tree_height_AVL(node.right))


def node_count_AVL(node):
    return 0 if node is None else 1 + node_count_AVL(node.left) + node_count_AVL(node.right)


def max_degree_AVL(node):
    if node is None:
        return 0
    degree = int(node.left is not None) + int(node.right is not None)
    return max(degree, max_degree_AVL(node.left), max_degree_AVL(node.right))


def density_AVL(node):
    h = tree_height_AVL(node)
    n = node_count_AVL(node)
    return round(n / h, 2) if h > 0 else 0


# --- Routes ---
@app.route('/avl/upload', methods=['POST'])
def upload_file_avl():
    global root_avl
    file = request.files['file']
    content = file.read().decode('utf-8')

    import re
    cleaned = content.replace('[', ' ').replace(']', ' ').replace(',', ' ')
    all_numbers = [int(n) for n in re.findall(r'\d+', cleaned)]

    filtered = [n for i, n in enumerate(all_numbers)]

    root_avl = None
    for v in filtered:
        root_avl = insert_avl(root_avl, v)

    return jsonify({
        'message': 'File uploaded and AVL built successfully!',
        'values': filtered
    })


@app.route('/avl/show', methods=['GET'])
def show_avl():
    global root_avl
    if root_avl is None:
        return jsonify({"message": "No AVL tree yet"}), 200
    return jsonify(to_dict_avl(root_avl)), 200


@app.route('/avl/info', methods=['GET'])
def get_info_avl():
    global root_avl
    if root_avl is None:
        return jsonify({"height": 0, "degree": 0, "density": 0}), 200
    info = {
        "height": tree_height_AVL(root_avl),
        "degree": max_degree_AVL(root_avl),
        "density": density_AVL(root_avl)
    }
    return jsonify(info), 200


@app.route('/avl/delete', methods=['POST'])
def delete_value_avl():
    global root_avl
    data = request.get_json()
    value = data.get('value')
    
    if root_avl is None:
        return jsonify({"message": "No AVL tree to delete from", "success": False}), 400
    
    # Check if value exists
    if not search_avl(root_avl, value):
        return jsonify({"message": f"Value {value} does not exist in the tree", "success": False}), 404
    
    # Delete the value
    root_avl = delete_avl(root_avl, value)
    
    return jsonify({
        "message": f"Value {value} deleted successfully",
        "success": True,
        "tree": to_dict_avl(root_avl)
    }), 200


@app.route('/avl/search', methods=['POST'])
def search_value_avl():
    global root_avl
    data = request.get_json()
    value = data.get('value')
    
    if root_avl is None:
        return jsonify({"message": "No AVL tree to search in", "exists": False}), 400
    
    exists = search_avl(root_avl, value)
    
    return jsonify({
        "value": value,
        "exists": exists,
        "message": f"Value {value} {'exists' if exists else 'does not exist'} in the tree"
    }), 200

# -------------------- TAS MAX (Max-Heap) --------------------
class MaxHeap:
    def __init__(self):
        self.heap = []

    def insert(self, value):
        self.heap.append(value)
        self._heapify_up(len(self.heap) - 1)

    def reset(self):
        self.heap = []

    def _heapify_up(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[index] > self.heap[parent]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._heapify_up(parent)

    def _heapify_down(self, index):
        largest = index
        left = 2 * index + 1
        right = 2 * index + 2
        
        if left < len(self.heap) and self.heap[left] > self.heap[largest]:
            largest = left
            
        if right < len(self.heap) and self.heap[right] > self.heap[largest]:
            largest = right
            
        if largest != index:
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            self._heapify_down(largest)

    def delete(self, value):
        # Find the index of the value to delete
        try:
            index = self.heap.index(value)
        except ValueError:
            return False  # Value not found
        
        # Replace the value to delete with the last element
        last_element = self.heap.pop()
        if index < len(self.heap):
            self.heap[index] = last_element
            # Determine whether to heapify up or down
            parent = (index - 1) // 2
            if index > 0 and self.heap[index] > self.heap[parent]:
                self._heapify_up(index)
            else:
                self._heapify_down(index)
        
        return True  # Deletion successful

    def search(self, value):
        return value in self.heap

    def _to_tree_dict(self, index=0):
        if index >= len(self.heap):
            return None
        left = self._to_tree_dict(2 * index + 1)
        right = self._to_tree_dict(2 * index + 2)
        return {
            "name": str(self.heap[index]),
            "children": [c for c in [left, right] if c]
        }

    def tree_height(self, index=0):
        if index >= len(self.heap):
            return 0
        return 1 + max(self.tree_height(2 * index + 1), self.tree_height(2 * index + 2))

    def node_count(self):
        return len(self.heap)

    def max_degree(self, index=0):
        if index >= len(self.heap):
            return 0
        degree = 0
        if 2 * index + 1 < len(self.heap): degree += 1
        if 2 * index + 2 < len(self.heap): degree += 1
        return max(degree,
                   self.max_degree(2 * index + 1),
                   self.max_degree(2 * index + 2))

    def density(self):
        h = self.tree_height()
        n = self.node_count()
        return n / h if h > 0 else 0

# Create a global instance of MaxHeap
heap = MaxHeap()

# --- Routes ---

@app.route("/tasmax/insert", methods=["POST"])
def insert_tasmax():
    value = request.json["value"]
    heap.insert(value)
    return jsonify(heap._to_tree_dict())

@app.route("/tasmax/delete", methods=["POST"])
def delete_tasmax():
    value = request.json["value"]
    success = heap.delete(value)
    if success:
        return jsonify({
            "message": f"Value {value} deleted successfully!",
            "tree": heap._to_tree_dict()
        })
    else:
        return jsonify({
            "message": f"Value {value} not found in the heap!",
            "tree": heap._to_tree_dict()
        }), 404

@app.route("/tasmax/search", methods=["POST"])
def search_tasmax():
    value = request.json["value"]
    found = heap.search(value)
    return jsonify({
        "value": value,
        "found": found,
        "message": f"Value {value} {'found' if found else 'not found'} in the heap!"
    })

@app.route("/tasmax/reset", methods=["POST"])
def reset_tasmax():
    heap.reset()
    return jsonify({"message": "TasMax reset!"})

@app.route('/tasmax/upload', methods=['POST'])
def upload_file_tasmax():
    # Reset the heap before inserting new values
    heap.reset()
    
    file = request.files['file']
    content = file.read().decode('utf-8')

    import re
    cleaned = content.replace('[', ' ').replace(']', ' ').replace(',', ' ')
    all_numbers = [int(n) for n in re.findall(r'\d+', cleaned)]

    filtered = [n for i, n in enumerate(all_numbers) if (i + 1) % 3 != 0]

    # Insert each value into the heap
    for v in filtered:
        heap.insert(v)

    return jsonify({
        'message': 'File uploaded and TASMAX built successfully!',
        'values': filtered
    })

@app.route('/tasmax/show', methods=['GET'])
def show_tasmax():
    if not heap.heap:
        return jsonify({"message": "No TASMAX tree yet"}), 200
    return jsonify(heap._to_tree_dict()), 200

@app.route('/tasmax/info', methods=['GET'])
def get_info_tasmax():
    if not heap.heap:
        return jsonify({"height": 0, "degree": 0, "density": 0}), 200
    info = {
        "height": heap.tree_height(),
        "degree": heap.max_degree(),
        "density": heap.density()
    }
    return jsonify(info), 200


# -------------------- TAS MIN (Min-Heap) --------------------
class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, value):
        self.heap.append(value)
        self._heapify_up(len(self.heap) - 1)

    def reset(self):
        self.heap = []

    def _heapify_up(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[index] < self.heap[parent]:  # Changed comparison
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._heapify_up(parent)

    def _heapify_down(self, index):
        smallest = index  # Changed from 'largest' to 'smallest'
        left = 2 * index + 1
        right = 2 * index + 2
        
        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:  # Changed comparison
            smallest = left
            
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:  # Changed comparison
            smallest = right
            
        if smallest != index:
            self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
            self._heapify_down(smallest)  # Changed from 'largest' to 'smallest'

    def delete(self, value):
        # Find the index of the value to delete
        try:
            index = self.heap.index(value)
        except ValueError:
            return False  # Value not found
        
        # Replace the value to delete with the last element
        last_element = self.heap.pop()
        if index < len(self.heap):
            self.heap[index] = last_element
            # Determine whether to heapify up or down
            parent = (index - 1) // 2
            if index > 0 and self.heap[index] < self.heap[parent]:  # Changed comparison
                self._heapify_up(index)
            else:
                self._heapify_down(index)
        
        return True  # Deletion successful

    def search(self, value):
        return value in self.heap

    def _to_tree_dict(self, index=0):
        if index >= len(self.heap):
            return None
        left = self._to_tree_dict(2 * index + 1)
        right = self._to_tree_dict(2 * index + 2)
        return {
            "name": str(self.heap[index]),
            "children": [c for c in [left, right] if c]
        }

    def tree_height(self, index=0):
        if index >= len(self.heap):
            return 0
        return 1 + max(self.tree_height(2 * index + 1), self.tree_height(2 * index + 2))

    def node_count(self):
        return len(self.heap)

    def max_degree(self, index=0):
        if index >= len(self.heap):
            return 0
        degree = 0
        if 2 * index + 1 < len(self.heap): degree += 1
        if 2 * index + 2 < len(self.heap): degree += 1
        return max(degree,
                   self.max_degree(2 * index + 1),
                   self.max_degree(2 * index + 2))

    def density(self):
        h = self.tree_height()
        n = self.node_count()
        return n / h if h > 0 else 0

# Create a global instance of MinHeap
heap = MinHeap()

# --- Routes ---

@app.route("/tasmin/insert", methods=["POST"])
def insert_tasmin():
    value = request.json["value"]
    heap.insert(value)
    return jsonify(heap._to_tree_dict())

@app.route("/tasmin/delete", methods=["POST"])
def delete_tasmin():
    value = request.json["value"]
    success = heap.delete(value)
    if success:
        return jsonify({
            "message": f"Value {value} deleted successfully!",
            "tree": heap._to_tree_dict()
        })
    else:
        return jsonify({
            "message": f"Value {value} not found in the heap!",
            "tree": heap._to_tree_dict()
        }), 404

@app.route("/tasmin/search", methods=["POST"])
def search_tasmin():
    value = request.json["value"]
    found = heap.search(value)
    return jsonify({
        "value": value,
        "found": found,
        "message": f"Value {value} {'found' if found else 'not found'} in the heap!"
    })

@app.route("/tasmin/reset", methods=["POST"])
def reset_tasmin():
    heap.reset()
    return jsonify({"message": "TasMin reset!"})

@app.route('/tasmin/upload', methods=['POST'])
def upload_file_tasmin():
    # Reset the heap before inserting new values
    heap.reset()
    
    file = request.files['file']
    content = file.read().decode('utf-8')

    import re
    cleaned = content.replace('[', ' ').replace(']', ' ').replace(',', ' ')
    all_numbers = [int(n) for n in re.findall(r'\d+', cleaned)]

    # filtered = [n for i, n in enumerate(all_numbers) if (i + 1) % 3 != 0]

    # Insert each value into the heap
    for v in all_numbers:
        heap.insert(v)

    return jsonify({
        'message': 'File uploaded and TASMIN built successfully!',
        'values': all_numbers
    })

@app.route('/tasmin/show', methods=['GET'])
def show_tasmin():
    if not heap.heap:
        return jsonify({"message": "No TASMIN tree yet"}), 200
    return jsonify(heap._to_tree_dict()), 200

@app.route('/tasmin/info', methods=['GET'])
def get_info_tasmin():
    if not heap.heap:
        return jsonify({"height": 0, "degree": 0, "density": 0}), 200
    info = {
        "height": heap.tree_height(),
        "degree": heap.max_degree(),
        "density": heap.density()
    }
    return jsonify(info), 200





# --------------------------------- TP3 --------------------------------------

# -------------------- Tri ABR --------------------

import time

def InOrder(node):
    if node is None:
        return []
    return InOrder(node.left) + [node.value] + InOrder(node.right)


@app.route("/TriABR", methods=["GET"])
def tri_abr():

    global root_abr

    start_time = time.time()

    if root_abr is None:
        Time = round((time.time() - start_time) * 1000, 4)
        return jsonify({"sorted_values": [], "execution_time_ms": Time})

    values = InOrder(root_abr)

    Time = round((time.time() - start_time) * 1000, 4)

    return jsonify({
        "sorted_values": values,
        "execution_time_ms": Time
    })


@app.route('/TriABR/show', methods=['GET'])
def show_tri_abr():
    return tri_abr()




# -------------------- Tri AVL --------------------

def PostOrder(node):
    if node is None:
        return []
    return PostOrder(node.right) + [node.value] + PostOrder(node.left)


@app.route("/TriAVL", methods=["GET"])
def tri_avl():

    global root_avl

    start_time = time.time()

    if root_avl is None:
        Time = round((time.time() - start_time) * 1000, 4)
        return jsonify({"sorted_values": [], "execution_time_ms": Time})

    values = PostOrder(root_avl)

    Time = round((time.time() - start_time) * 1000, 4)

    return jsonify({
        "sorted_values": values,
        "execution_time_ms": Time
    })


@app.route('/TriAVL/show', methods=['GET'])
def show_tri_avl():
    return tri_avl()


if __name__ == "__main__":
    app.run(debug=True)





# # ---- AMR ----
# class NodeAMR:
#     def __init__(self, order):
#         self.keys = []
#         self.children = []
#         self.order = order  # m

# root_amr = None
# order_amr = None


# def insert_amr(node, value, order):
#     # If node doesn't exist, create one
#     if node is None:
#         new_node = NodeAMR(order)
#         new_node.keys = [value]
#         return new_node

#     # If node has room for another key (less than m-1)
#     if len(node.keys) < order - 1 and len(node.children) == 0:
#         node.keys.append(value)
#         node.keys.sort()
#         return node

#     # Otherwise, find which child to insert into
#     i = 0
#     while i < len(node.keys) and value > node.keys[i]:
#         i += 1

#     # Ensure the node has m children
#     while len(node.children) < order:
#         node.children.append(None)

#     # Recursive insertion
#     node.children[i] = insert_amr(node.children[i], value, order)
#     return node


# def to_dict_amr(node):
#     if node is None:
#         return None
#     return {
#         "name": ", ".join(map(str, node.keys)) if node.keys else "•",
#         "children": [to_dict_amr(c) for c in node.children if c is not None]
#     }


# # ---- Info Functions ----
# def tree_height_amr(node):
#     if node is None:
#         return 0
#     # Filter out None children
#     valid_children = [c for c in node.children if c is not None]
#     if not valid_children:
#         return 1
#     return 1 + max(tree_height_amr(c) for c in valid_children)


# def node_count_amr(node):
#     if node is None:
#         return 0
#     valid_children = [c for c in node.children if c is not None]
#     return 1 + sum(node_count_amr(c) for c in valid_children)


# def max_degree_amr(node):
#     if node is None:
#         return 0
#     valid_children = [c for c in node.children if c is not None]
#     current_degree = len(valid_children)
#     return max([current_degree] + [max_degree_amr(c) for c in valid_children])


# def density_amr(node):
#     h = tree_height_amr(node)
#     n = node_count_amr(node)
#     # Avoid division by zero
#     return (n / h) if h > 0 else 0




# # ---- Flask Routes ----
# @app.route("/amr/set_order", methods=["POST"])
# def set_order_amr():
#     global order_amr, root_amr
#     data = request.json
#     order_amr = data["order"]
#     root_amr = None
#     return jsonify({"message": f"Ordre fixé à {order_amr}"})


# @app.route("/amr/insert", methods=["POST"])
# def insert_value_amr():
#     global root_amr, order_amr
#     if order_amr is None:
#         return jsonify({"error": "Ordre non défini"}), 400
#     value = request.json["value"]
#     root_amr = insert_amr(root_amr, value, order_amr)
#     return jsonify(to_dict_amr(root_amr))


# @app.route("/amr/reset", methods=["POST"])
# def reset_tree_amr():
#     global root_amr
#     root_amr = None
#     return jsonify({"message": "AMR réinitialisé"})


# @app.route("/amr/info", methods=["GET"])
# def get_info_amr():
#     global root_amr

#     if root_amr is None:
#         return jsonify({
#             "height": 0,
#             "degree": 0,
#             "density": 0
#         })

#     try:
#         info = {
#             "height": tree_height_amr(root_amr),
#             "degree": max_degree_amr(root_amr),
#             "density": density_amr(root_amr),
#         }
#         return jsonify(info)
#     except Exception as e:
#         print("Error in /amr/info:", e)
#         return jsonify({"error": str(e)}), 500




# # ----------------- B-tree implementation -----------------
# class NodeBArber:
#     def __init__(self, order, is_leaf=True):
#         self.keys = []         # list of keys in node
#         self.children = []     # list of child NodeBArber (length = len(keys)+1 if internal)
#         self.order = order     # order (m). In this implementation, a node can hold up to (order - 1) keys
#         self.is_leaf = is_leaf

#     def __repr__(self):
#         return f"Node(keys={self.keys}, leaf={self.is_leaf})"


# def split_child(parent, index):

#     child = parent.children[index]
#     mid = len(child.keys) // 2
#     new_child = NodeBArber(child.order, is_leaf=child.is_leaf)

#     # median key to promote
#     mid_key = child.keys[mid]

#     # Right half (keys after median) -> new_child.keys
#     new_child.keys = child.keys[mid + 1 :]
#     # Left half (keys before median) remains in child
#     child.keys = child.keys[:mid]

#     # If child had children (i.e., not a leaf), split its children as well
#     if not child.is_leaf:
#         # children are len(old_child.keys) + 1 originally
#         # Right half children go to new_child
#         new_child.children = child.children[mid + 1 :]
#         # Left half children remain in child
#         child.children = child.children[: mid + 1]

#     # Insert the median key into parent and new_child as parent's new child
#     parent.keys.insert(index, mid_key)
#     parent.children.insert(index + 1, new_child)


# def insert_non_full(node, value):

#     i = len(node.keys) - 1

#     if node.is_leaf:
#         # Insert value into the keys list and keep them sorted
#         node.keys.append(value)
#         node.keys.sort()
#         return

#     # find child index to descend into
#     while i >= 0 and value < node.keys[i]:
#         i -= 1
#     i += 1

#     # If the child is full, split it
#     # child full condition: len(node.children[i].keys) == node.order - 1
#     if len(node.children[i].keys) == node.order - 1:
#         split_child(node, i)
#         # After split, the parent gained a key at position i.
#         # Decide whether to go to left or right child
#         if value > node.keys[i]:
#             i += 1

#     insert_non_full(node.children[i], value)


# def insert_barber(root, value, order):

#     if root is None:
#         new_root = NodeBArber(order)
#         new_root.keys = [value]
#         return new_root

#     # If root is full, need to split and increase tree height
#     if len(root.keys) == order - 1:
#         new_root = NodeBArber(order, is_leaf=False)
#         new_root.children.append(root)
#         split_child(new_root, 0)
#         # choose correct child after split
#         idx = 0
#         if value > new_root.keys[0]:
#             idx = 1
#         insert_non_full(new_root.children[idx], value)
#         return new_root
#     else:
#         insert_non_full(root, value)
#         return root


# def to_dict_barber(node):

#     if node is None:
#         return None
#     name = ", ".join(map(str, node.keys)) if node.keys else "•"
#     return {
#         "name": name,
#         "children": [to_dict_barber(c) for c in node.children] if node.children else []
#     }


# # ----------------- Info functions -----------------
# def height_barber(node):
#     # height measured as number of levels (root at level 1)
#     if node is None:
#         return 0
#     if node.is_leaf:
#         return 1
#     return 1 + height_barber(node.children[0])


# def degree_barber(node):
#     # maximum number of children among nodes (i.e., max degree)
#     if node is None:
#         return 0
#     current_children = len([c for c in node.children if c is not None])
#     max_child = current_children
#     for c in node.children:
#         if c is not None:
#             max_child = max(max_child, degree_barber(c))
#     return max_child


# def node_count_barber(node):
#     if node is None:
#         return 0
#     cnt = 1
#     for c in node.children:
#         if c is not None:
#             cnt += node_count_barber(c)
#     return cnt


# def density_barber(node):
#     h = height_barber(node)
#     n = node_count_barber(node)
#     return float(n) / float(h) if h > 0 else 0.0


# # ----------------- Flask app state -----------------
# order_barber = None  # will hold m (order)
# root_barber = None   # root NodeBArber


# # ----------------- Flask routes -----------------
# @app.route("/B_arber/set_order", methods=["POST"])
# def set_order_barber():
#     global order_barber, root_barber
#     data = request.json or {}
#     try:
#         m = int(data.get("order"))
#     except Exception:
#         return jsonify({"error": "Order must be an integer."}), 400
#     # require odd and >= 3 (m = 2*d + 1)
#     if m < 3 or m % 2 == 0:
#         return jsonify({"error": "Order must be odd and >= 3 (m = 2*d + 1)."}), 400
#     order_barber = m
#     root_barber = None
#     return jsonify({"message": f"Ordre fixé à {order_barber}"})


# @app.route("/B_arber/insert", methods=["POST"])
# def insert_value_barber():
#     global root_barber, order_barber
#     if order_barber is None:
#         return jsonify({"error": "Ordre non défini"}), 400
#     data = request.json or {}
#     try:
#         value = int(data.get("value"))
#     except Exception:
#         return jsonify({"error": "Value must be an integer."}), 400
#     try:
#         root_barber = insert_barber(root_barber, value, order_barber)
#         return jsonify(to_dict_barber(root_barber))
#     except Exception as e:
#         # defensive: return error message and 500
#         print("Error inserting value:", e)
#         return jsonify({"error": str(e)}), 500


# @app.route("/B_arber/reset", methods=["POST"])
# def reset_barber():
#     global root_barber
#     root_barber = None
#     return jsonify({"message": "B-arbre réinitialisé"})


# @app.route("/B_arber/info", methods=["GET"])
# def get_info_barber():
#     global root_barber
#     if root_barber is None:
#         return jsonify({"height": 0, "degree": 0, "density": 0.0})
#     try:
#         info = {
#             "height": height_barber(root_barber),
#             "degree": degree_barber(root_barber),
#             "density": density_barber(root_barber),
#         }
#         return jsonify(info)
#     except Exception as e:
#         print("Error in /B_arber/info:", e)
#         return jsonify({"error": str(e)}), 500


# @app.route("/B_arber/tree", methods=["GET"])
# def get_tree_barber():
#     global root_barber
#     if root_barber is None:
#         return jsonify(None)
#     return jsonify(to_dict_barber(root_barber))





# # -------------------- Main --------------------
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
