from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "https://tp-algo-1-0g5g.onrender.com/"}})
CORS(app)
# @app.route("/")

# ------------------------------------------    TP1     -------------------------------------


# --------------------------------- Graphe Non Oriente ----------------------------
graph_non_oriente = {}

def add_edge(graph, a, b):
    """Add edge a—b to undirected graph"""
    if a not in graph:
        graph[a] = []
    if b not in graph:
        graph[b] = []
    if b not in graph[a]:
        graph[a].append(b)
    if a not in graph[b]:
        graph[b].append(a)


@app.route("/grapheNonOriente/upload", methods=["POST"])
def upload_file_non_oriente():
    global graph_non_oriente
    file = request.files["file"]
    content = file.read().decode("utf-8")

    # 1️⃣ Remove brackets and commas
    cleaned = content.replace("[", " ").replace("]", " ").replace(",", " ")

    import re

    all_values = re.findall(r'\b[a-zA-Z0-9]+\b', cleaned)

    edges = []
    i = 0
    while i + 1 < len(all_values):
        a = all_values[i]
        b = all_values[i + 1]
        edges.append((a, b))
        i += 3


    graph_non_oriente = {}
    for a, b in edges:
        add_edge(graph_non_oriente, a, b)

    return jsonify({
        "message": "Graph Non Oriente uploaded successfully!",
        "graph": graph_non_oriente
    })


@app.route("/grapheNonOriente/get", methods=["GET"])
def get_graph_non_oriente():
    return jsonify({"graph": graph_non_oriente})


# ---------------- Graph orienté ----------------
graph_oriente = {}


def add_edge_oriente(graph, a, b):
    if a not in graph:
        graph[a] = []
    if b not in graph:
        graph[b] = []
    if b not in graph[a]:
        graph[a].append(b)


@app.route("/grapheOriente/upload", methods=["POST"])
def upload_file_oriente():
    global graph_oriente
    file = request.files["file"]
    content = file.read().decode("utf-8")

    cleaned = content.replace("[", " ").replace("]", " ").replace(",", " ")

    import re
    all_values = re.findall(r'\b[a-zA-Z0-9]+\b', cleaned)

    edges = []
    i = 0
    while i + 1 < len(all_values):
        a = all_values[i]
        b = all_values[i + 1]
        edges.append((a, b))
        i += 2

    graph_oriente = {}
    for a, b in edges:
        add_edge_oriente(graph_oriente, a, b)

    return jsonify({
        "message": "Graph Orienté uploaded successfully!",
        "graph": graph_oriente
    })


@app.route("/grapheOriente/get", methods=["GET"])
def get_graph_oriente():
    return jsonify({"graph": graph_oriente})




# ---------------- Graph  pondéré ----------------
graph_pondere = {}

def add_edge_pondere(graph, a, b, poids):

    if a not in graph:
        graph[a] = []
    if b not in graph:
        graph[b] = []
    graph[a].append((b, poids))


@app.route("/graphePondere/upload", methods=["POST"])
def upload_file_pondere():
    global graph_pondere
    file = request.files["file"]
    content = file.read().decode("utf-8")


    cleaned = content.replace("[", " ").replace("]", " ").replace(",", " ")
    import re
    all_values = re.findall(r"\b[a-zA-Z0-9]+\b", cleaned)

    edges = []
    i = 0
    while i + 2 < len(all_values):
        a = all_values[i]
        b = all_values[i + 1]
        poids = float(all_values[i + 2])
        edges.append((a, b, poids))
        i += 3

    graph_pondere = {}
    for a, b, poids in edges:
        add_edge_pondere(graph_pondere, a, b, poids)

    return jsonify({
        "message": "Graphe pondéré uploadé avec succès !",
        "graph": graph_pondere
    })


@app.route("/graphePondere/get", methods=["GET"])
def get_graph_pondere():
    return jsonify({"graph": graph_pondere})




# ----------------------------------------------------- TP2  ----------------------------------------

# -------------------- ABR --------------------
class NodeABR:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

root_abr = None

def insert_abr(node, value):
    if node is None:
        return NodeABR(value)
    if value < node.value:
        node.left = insert_abr(node.left, value)
    else:
        node.right = insert_abr(node.right, value)
    return node

def to_dict_abr(node):
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

def min_value_node(node):
    current = node
    while current.left is not None:
        current = current.left
    return current

def delete_abr(node, value):
    if node is None:
        return node
    if value < node.value:
        node.left = delete_abr(node.left, value)
    elif value > node.value:
        node.right = delete_abr(node.right, value)
    else:
        if node.left is None:
            temp = node.right
            node = None
            return temp
        elif node.right is None:
            temp = node.left
            node = None
            return temp
        temp = min_value_node(node.right)
        node.value = temp.value
        node.right = delete_abr(node.right, temp.value)

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

# -------------------- TAS MAX --------------------
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
        while index > 0 and self.heap[index] > self.heap[parent]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            index = parent
            parent = (index - 1) // 2

    def _heapify_down(self, index):
        size = len(self.heap)
        while True:
            largest = index
            left = 2 * index + 1
            right = 2 * index + 2

            if left < size and self.heap[left] > self.heap[largest]:
                largest = left
            if right < size and self.heap[right] > self.heap[largest]:
                largest = right

            if largest == index:
                break

            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            index = largest

    def delete(self, value):
        try:
            index = self.heap.index(value)
        except ValueError:
            return False  # Value not found
        
        last_element = self.heap.pop()
        if index < len(self.heap):
            self.heap[index] = last_element
            parent = (index - 1) // 2
            if index > 0 and self.heap[index] > self.heap[parent]:
                self._heapify_up(index)
            else:
                self._heapify_down(index)
        
        return True

    def search(self, value):
        return value in self.heap

    def _to_tree_dict(self, index=0):
        if index >= len(self.heap):
            return None
        left = self._to_tree_dict(2 * index + 1)
        right = self._to_tree_dict(2 * index + 2)
        return {
            "name": str(self.heap[index]),
            "children": [c for c in (left, right) if c]
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

# Create a clear global instance of MaxHeap
max_heap = MaxHeap()

# --- Routes ---
@app.route("/tasmax/insert", methods=["POST"])
def insert_tasmax():
    value = request.json.get("value")
    max_heap.insert(value)
    return jsonify({"success": True, "message": f"Inserted {value}", "tree": max_heap._to_tree_dict()})

@app.route("/tasmax/delete", methods=["POST"])
def delete_tasmax():
    value = request.json.get("value")
    success = max_heap.delete(value)
    if success:
        return jsonify({
            "success": True,
            "message": f"Value {value} deleted successfully!",
            "tree": max_heap._to_tree_dict()
        }), 200
    else:
        # return 200 but indicate success False so frontend can handle gracefully
        return jsonify({
            "success": False,
            "message": f"Value {value} not found in the heap!",
            "tree": max_heap._to_tree_dict()
        }), 200

@app.route("/tasmax/search", methods=["POST"])
def search_tasmax():
    value = request.json.get("value")
    found = max_heap.search(value)
    return jsonify({
        "success": True,
        "value": value,
        "found": found,
        "message": f"Value {value} {'found' if found else 'not found'} in the heap!"
    }), 200

@app.route("/tasmax/reset", methods=["POST"])
def reset_tasmax():
    max_heap.reset()
    return jsonify({"success": True, "message": "TasMax reset!", "tree": None})

@app.route('/tasmax/upload', methods=['POST'])
def upload_file_tasmax():
    # Reset the heap before inserting new values
    max_heap.reset()
    
    file = request.files['file']
    content = file.read().decode('utf-8')
    cleaned = content.replace('[', ' ').replace(']', ' ').replace(',', ' ')
    all_numbers = [int(n) for n in re.findall(r'\d+', cleaned)]

    # NOTE: keep same filtering logic if you need it; here I keep your filter
    filtered = [n for i, n in enumerate(all_numbers) if (i + 1) % 3 != 0]

    for v in filtered:
        max_heap.insert(v)

    return jsonify({
        'success': True,
        'message': 'File uploaded and TASMAX built successfully!',
        'values': filtered,
        'tree': max_heap._to_tree_dict()
    }), 200

@app.route('/tasmax/show', methods=['GET'])
def show_tasmax():
    return jsonify({"tree": max_heap._to_tree_dict()}), 200

@app.route('/tasmax/info', methods=['GET'])
def get_info_tasmax():
    if not max_heap.heap:
        return jsonify({"height": 0, "degree": 0, "density": 0}), 200
    info = {
        "height": max_heap.tree_height(),
        "degree": max_heap.max_degree(),
        "density": max_heap.density()
    }
    return jsonify(info), 200


# -------------------- TAS MIN  --------------------
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
        if index > 0 and self.heap[index] < self.heap[parent]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._heapify_up(parent)

    def _heapify_down(self, index):
        smallest = index
        left = 2 * index + 1
        right = 2 * index + 2

        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
            smallest = right
        if smallest != index:
            self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
            self._heapify_down(smallest)

    def delete(self, value):
        try:
            index = self.heap.index(value)
        except ValueError:
            return False
        last_element = self.heap.pop()
        if index < len(self.heap):
            self.heap[index] = last_element
            parent = (index - 1) // 2
            if index > 0 and self.heap[index] < self.heap[parent]:
                self._heapify_up(index)
            else:
                self._heapify_down(index)
        return True

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

def inorder_traversal_sequence_abr(node, sequence=None):
    if sequence is None:
        sequence = []
    if node is None:
        return sequence
    inorder_traversal_sequence_abr(node.left, sequence)
    sequence.append(node.value)
    inorder_traversal_sequence_abr(node.right, sequence)
    return sequence

def to_dict_abr_with_highlight(node, highlight_value=None):
    if node is None:
        return None
    is_highlighted = node.value == highlight_value
    return {
        "name": str(node.value),
        "attributes": {
            "highlight": is_highlighted
        },
        "children": [
            child for child in [
                to_dict_abr_with_highlight(node.left, highlight_value),
                to_dict_abr_with_highlight(node.right, highlight_value)
            ] if child
        ]
    }
@app.route("/TriABR", methods=["GET"])
def tri_abr():
    global root_abr
    if root_abr is None:
        return jsonify({"sorted_values": []})
    
    values = inorder_traversal_sequence_abr(root_abr)
    return jsonify({"sorted_values": values})

@app.route('/TriABR/show', methods=['GET'])
def show_tri_abr():
    return tri_abr()

@app.route('/abr/traversal/sequence', methods=['GET'])
def get_traversal_sequence_abr():
    global root_abr
    if root_abr is None:
        return jsonify({"sequence": []}), 200
    sequence = inorder_traversal_sequence_abr(root_abr)
    return jsonify({"sequence": sequence}), 200

@app.route('/abr/tree/highlight/<int:value>', methods=['GET'])
def get_tree_with_highlight_abr(value):
    global root_abr
    if root_abr is None:
        return jsonify({"message": "No ABR tree yet"}), 200
    return jsonify(to_dict_abr_with_highlight(root_abr, value)), 200




# -------------------- Tri AVL --------------------

# Add these functions to your AVL code

def inorder_traversal_sequence(node, sequence=None):
    if sequence is None:
        sequence = []
    if node is None:
        return sequence
    inorder_traversal_sequence(node.left, sequence)
    sequence.append(node.value)
    inorder_traversal_sequence(node.right, sequence)
    return sequence

def to_dict_avl_with_highlight(node, highlight_value=None):
    if node is None:
        return None
    is_highlighted = node.value == highlight_value
    return {
        "name": str(node.value),
        "attributes": {
            "highlight": is_highlighted
        },
        "children": [child for child in [to_dict_avl_with_highlight(node.left, highlight_value),
                                    to_dict_avl_with_highlight(node.right, highlight_value)] if child]
    }

# Add these new routes
@app.route('/avl/traversal/sequence', methods=['GET'])
def get_traversal_sequence():
    global root_avl
    if root_avl is None:
        return jsonify({"sequence": []}), 200
    sequence = inorder_traversal_sequence(root_avl)
    return jsonify({"sequence": sequence}), 200

@app.route('/avl/tree/highlight/<int:value>', methods=['GET'])
def get_tree_with_highlight(value):
    global root_avl
    if root_avl is None:
        return jsonify({"message": "No AVL tree yet"}), 200
    return jsonify(to_dict_avl_with_highlight(root_avl, value)), 200

@app.route("/TriAVL", methods=["GET"])
def tri_avl():

    global root_avl

    start_time = time.time()

    if root_avl is None:
        Time = round((time.time() - start_time) * 1000, 4)
        return jsonify({"sorted_values": [], "execution_time_ms": Time})

    values = InOrder(root_avl)

    Time = round((time.time() - start_time) * 1000, 4)

    return jsonify({
        "sorted_values": values,
        "execution_time_ms": Time
    })


@app.route('/TriAVL/show', methods=['GET'])
def show_tri_avl():
    return tri_avl()

# ---------------------------- Tri TASMAX ---------------------------
# ---------------------------- Tri TASMAX ---------------------------
import time

# Fonction pour obtenir la structure du tas avec mise en évidence
def max_heap_to_dict_with_highlight(heap, highlight_index=None):
    if not heap:
        return None
    
    def build_node(index):
        if index >= len(heap):
            return None
        
        left_index = 2 * index + 1
        right_index = 2 * index + 2
        
        is_highlighted = index == highlight_index
        
        node = {
            "name": str(heap[index]),
            "attributes": {
                "highlight": is_highlighted
            }
        }
        
        children = []
        left_child = build_node(left_index)
        right_child = build_node(right_index)
        
        if left_child:
            children.append(left_child)
        if right_child:
            children.append(right_child)
            
        if children:
            node["children"] = children
            
        return node
    
    return build_node(0)

# Fonction pour obtenir la séquence d'extraction
def get_max_extraction_sequence(heap):
    if not heap:
        return []
    
    # Créer une copie du tas pour ne pas modifier l'original
    heap_copy = heap.copy()
    sequence = []
    
    while heap_copy:
        # Extraire le maximum (racine)
        max_val = heap_copy[0]
        sequence.append(max_val)
        
        # Remplacer la racine par le dernier élément
        heap_copy[0] = heap_copy[-1]
        heap_copy.pop()
        
        # Reconstituer le tas (max heapify)
        if heap_copy:
            max_heapify(heap_copy, 0)
    
    return sequence

# Fonction max_heapify pour reconstituer le tas maximum
def max_heapify(heap, i):
    n = len(heap)
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and heap[left] > heap[largest]:
        largest = left
    
    if right < n and heap[right] > heap[largest]:
        largest = right
    
    if largest != i:
        heap[i], heap[largest] = heap[largest], heap[i]
        max_heapify(heap, largest)

@app.route("/TriTASMAX", methods=["GET"])
def tri_tasmax():
    global heap
    start_time = time.time()
    if not heap.heap:
        Time = round((time.time() - start_time) * 1000, 4)
        return jsonify({"sorted_values": [], "execution_time_ms": Time})

    # Sort values from largest to smallest (descending order)
    sorted_values = sorted(heap.heap, reverse=True)

    Time = round((time.time() - start_time) * 1000, 4)
    return jsonify({
        "sorted_values": sorted_values,
        "execution_time_ms": Time
    })

@app.route('/TriTASMAX/show', methods=['GET'])
def show_tri_tasmax():
    return tri_tasmax()

# Nouvelles routes pour l'animation
@app.route('/tasmax/extraction/sequence', methods=['GET'])
def get_max_extraction_sequence_route():
    global heap
    if not heap.heap:
        return jsonify({"sequence": []}), 200
    sequence = get_max_extraction_sequence(heap.heap)
    return jsonify({"sequence": sequence}), 200

@app.route('/tasmax/heap/step/<int:step>', methods=['GET'])
def get_max_heap_at_step(step):
    global heap
    if not heap.heap:
        return jsonify({"message": "No heap yet"}), 200
    
    # Créer une copie du tas pour simuler l'état à l'étape donnée
    heap_copy = heap.heap.copy()
    
    # Simuler l'extraction jusqu'à l'étape donnée
    for i in range(step):
        if not heap_copy:
            break
        
        # Extraire le maximum (racine)
        heap_copy[0] = heap_copy[-1]
        heap_copy.pop()
        
        # Reconstituer le tas maximum
        if heap_copy:
            max_heapify(heap_copy, 0)
    
    # Déterminer quel élément sera extrait à l'étape suivante
    highlight_index = 0 if heap_copy else None
    
    return jsonify(max_heap_to_dict_with_highlight(heap_copy, highlight_index)), 200

# ---------------------------- Tri TASMIN ---------------------------

def heap_to_dict_with_highlight(heap, highlight_index=None):
    if not heap:
        return None
    def build_node(index):
        if index >= len(heap):
            return None
        left_index = 2 * index + 1
        right_index = 2 * index + 2
        is_highlighted = index == highlight_index
        node = {
            "name": str(heap[index]),
            "attributes": {
                "highlight": is_highlighted
            }
        }
        children = []
        left_child = build_node(left_index)
        right_child = build_node(right_index)
        if left_child:
            children.append(left_child)
        if right_child:
            children.append(right_child)
        if children:
            node["children"] = children
        return node
    return build_node(0)


def get_extraction_sequence(heap):
    if not heap:
        return []
    heap_copy = heap.copy()
    sequence = []
    while heap_copy:
        min_val = heap_copy[0]
        sequence.append(min_val)
        heap_copy[0] = heap_copy[-1]
        heap_copy.pop()
        if heap_copy:
            heapify(heap_copy, 0)
    return sequence

def heapify(heap, i):
    n = len(heap)
    smallest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and heap[left] < heap[smallest]:
        smallest = left
    if right < n and heap[right] < heap[smallest]:
        smallest = right
    if smallest != i:
        heap[i], heap[smallest] = heap[smallest], heap[i]
        heapify(heap, smallest)

@app.route("/TriTASMIN", methods=["GET"])
def tri_tasmin():
    global heap
    if not heap.heap:
        return jsonify({"sorted_values": []})
    sorted_values = sorted(heap.heap)
    return jsonify({
        "sorted_values": sorted_values,
    })

@app.route('/TriTASMIN/show', methods=['GET'])
def show_tri_tasmin():
    return tri_tasmin()
@app.route('/tasmin/extraction/sequence', methods=['GET'])
def get_extraction_sequence_route():
    global heap
    if not heap.heap:
        return jsonify({"sequence": []}), 200
    sequence = get_extraction_sequence(heap.heap)
    return jsonify({"sequence": sequence}), 200

@app.route('/tasmin/heap/step/<int:step>', methods=['GET'])
def get_heap_at_step(step):
    global heap
    if not heap.heap:
        return jsonify({"message": "No heap yet"}), 200
    heap_copy = heap.heap.copy()
    for i in range(step):
        if not heap_copy:
            break
        heap_copy[0] = heap_copy[-1]
        heap_copy.pop()
        if heap_copy:
            heapify(heap_copy, 0)
    highlight_index = 0 if heap_copy else None
    return jsonify(heap_to_dict_with_highlight(heap_copy, highlight_index)), 200




# ---------------------------------- Tri Bitonique ---------------------------
steps = []
uploaded_numbers = []

def compare_and_swap(arr, low, cnt, direction):
    if cnt > 1:
        k = cnt // 2
        for i in range(low, low + k):
            if i + k < len(arr):
                if (direction == 1 and arr[i] > arr[i + k]) or \
                    (direction == 0 and arr[i] < arr[i + k]):
                    # Convert any Infinity values to strings for JSON compatibility
                    array_copy = ["Infinity" if x == float('inf') else x for x in arr]
                    steps.append({
                        "array": array_copy,
                        "swapped": [i, i + k],
                        "comparing": []
                    })
                    arr[i], arr[i + k] = arr[i + k], arr[i]
                    array_copy = ["Infinity" if x == float('inf') else x for x in arr]
                    steps.append({
                        "array": array_copy,
                        "swapped": [],
                        "comparing": []
                    })
                else:
                    # Convert any Infinity values to strings for JSON compatibility
                    array_copy = ["Infinity" if x == float('inf') else x for x in arr]
                    steps.append({
                        "array": array_copy,
                        "swapped": [],
                        "comparing": [i, i + k]
                    })

def bitonic_merge(arr, low, cnt, direction):
    if cnt > 1:
        k = cnt // 2
        compare_and_swap(arr, low, cnt, direction)
        bitonic_merge(arr, low, k, direction)
        bitonic_merge(arr, low + k, k, direction)

def bitonic_sort_recursive(arr, low, cnt, direction):
    if cnt > 1:
        k = cnt // 2
        bitonic_sort_recursive(arr, low, k, 1)
        bitonic_sort_recursive(arr, low + k, k, 0)
        bitonic_merge(arr, low, cnt, direction)

def bitonic_sort(arr):
    n = len(arr)
    # Find the next power of 2 greater than or equal to n
    power_of_2 = 1
    while power_of_2 < n:
        power_of_2 *= 2
    
    # Store original length to remove padding later
    original_length = n
    
    # If n is not a power of 2, pad with +infinity
    if n != power_of_2:
        # Add initial state step before padding
        array_copy = ["Infinity" if x == float('inf') else x for x in arr]
        steps.append({
            "array": array_copy,
            "swapped": [],
            "comparing": []
        })
        
        # Pad with +infinity
        arr.extend([float('inf')] * (power_of_2 - n))
        
        # Add a step to show the padding
        array_copy = ["Infinity" if x == float('inf') else x for x in arr]
        steps.append({
            "array": array_copy,
            "swapped": [],
            "comparing": list(range(original_length, power_of_2))
        })
    
    # Perform bitonic sort on the padded array
    bitonic_sort_recursive(arr, 0, power_of_2, 1)
    
    # Remove the padding (if any)
    if len(arr) > original_length:
        # Add a step before removing padding
        array_copy = ["Infinity" if x == float('inf') else x for x in arr]
        steps.append({
            "array": array_copy,
            "swapped": [],
            "comparing": list(range(original_length, len(arr)))
        })
        
        # Remove the padding
        arr = arr[:original_length]
        
        # Add final state step
        array_copy = ["Infinity" if x == float('inf') else x for x in arr]
        steps.append({
            "array": array_copy,
            "swapped": [],
            "comparing": []
        })
    
    return arr

# -------------------- ROUTES --------------------
import re
@app.route('/bitonique/upload', methods=['POST'])
def bitonique_upload_file():
    """Receive file and store numbers (no sorting yet)."""
    global uploaded_numbers
    uploaded_numbers = []  # reset old data

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        content = file.read().decode('utf-8')
        numbers = list(map(int, re.findall(r'-?\d+', content)))

        if not numbers:
            return jsonify({"error": "No numbers found in file"}), 400

        uploaded_numbers = numbers  # save numbers globally
        return jsonify({"message": "File uploaded successfully!", "numbers": numbers}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/bitonique/sort', methods=['GET'])
def sort_uploaded_file():
    """Perform the Bitonic Sort on the last uploaded numbers."""
    global steps, uploaded_numbers
    steps = []

    if not uploaded_numbers:
        return jsonify({"error": "No file uploaded yet!"}), 400

    arr = uploaded_numbers.copy()
    # Use the new bitonic_sort function that handles non-power-of-2 arrays with +infinity padding
    sorted_arr = bitonic_sort(arr)
    
    return jsonify({"steps": steps}), 200



# ---------------------------- TP4 -----------------------------
# ------------ Prim ---------------


# Add this to your existing Flask app
import heapq

# Store Prim's algorithm steps globally
prim_steps = []

@app.route("/prim/upload", methods=["POST"])
def upload_file_prim():
    global graph_pondere, prim_steps
    
    file = request.files["file"]
    content = file.read().decode("utf-8")
    
    # Parse the file content to build the graph
    cleaned = content.replace("[", " ").replace("]", " ").replace(",", " ")
    import re
    all_values = re.findall(r"\b[a-zA-Z0-9]+\b", cleaned)
    
    edges = []
    i = 0
    while i + 2 < len(all_values):
        a = all_values[i]
        b = all_values[i + 1]
        poids = float(all_values[i + 2])
        edges.append((a, b, poids))
        i += 3
    
    graph_pondere = {}
    for a, b, poids in edges:
        add_edge_pondere(graph_pondere, a, b, poids)
        # For undirected graph, add edge in both directions
        add_edge_pondere(graph_pondere, b, a, poids)
    
    # Reset steps
    prim_steps = []
    
    return jsonify({
        "message": "Graph uploaded successfully for Prim's algorithm!",
        "graph": graph_pondere
    })

@app.route("/prim/execute", methods=["GET"])
def execute_prim():
    global graph_pondere, prim_steps
    if not graph_pondere:
        return jsonify({"error": "No graph available. Please upload a graph first."})

    prim_steps = []
    start_node = next(iter(graph_pondere.keys()))
    visited = {start_node}
    min_spanning_tree = []

    prim_steps.append({
        "type": "start",
        "current_node": start_node,
        "visited": list(visited),
        "tree_edges": min_spanning_tree.copy(),
        "message": f"Starting Prim's algorithm from node {start_node}"
    })
    edges_queue = []

    for neighbor, weight in graph_pondere[start_node]:
        heapq.heappush(edges_queue, (weight, start_node, neighbor))

    while edges_queue and len(visited) < len(graph_pondere):
        weight, from_node, to_node = heapq.heappop(edges_queue)

        if to_node in visited:
            prim_steps.append({
                "type": "skip_edge",
                "edge": (from_node, to_node, weight),
                "visited": list(visited),
                "tree_edges": min_spanning_tree.copy(),
                "message": f"Skipping edge {from_node}-{to_node} (weight: {weight}) as {to_node} is already visited"
            })
            continue

        min_spanning_tree.append((from_node, to_node, weight))
        visited.add(to_node)

        prim_steps.append({
            "type": "add_edge",
            "edge": (from_node, to_node, weight),
            "visited": list(visited),
            "tree_edges": min_spanning_tree.copy(),
            "message": f"Adding edge {from_node}-{to_node} (weight: {weight}) to the MST"
        })

        for neighbor, w in graph_pondere[to_node]:
            if neighbor not in visited:
                heapq.heappush(edges_queue, (w, to_node, neighbor))

    total_weight = sum(edge[2] for edge in min_spanning_tree)

    prim_steps.append({
        "type": "complete",
        "tree_edges": min_spanning_tree,
        "total_weight": total_weight,
        "visited": list(visited),
        "message": f"Prim's algorithm complete. Total weight: {total_weight}"
    })
    
    return jsonify({
        "steps": prim_steps,
        "tree": min_spanning_tree,
        "total_weight": total_weight
    })

@app.route("/prim/steps", methods=["GET"])
def get_prim_steps():
    global prim_steps
    return jsonify({"steps": prim_steps})


# ------------------- Kruskal --------------------

# Add this to your existing Flask app
import heapq

# Store Kruskal's algorithm steps globally
kruskal_steps = []

@app.route("/kruskal/upload", methods=["POST"])
def upload_file_kruskal():
    global graph_pondere, kruskal_steps

    file = request.files["file"]
    content = file.read().decode("utf-8")

    cleaned = content.replace("[", " ").replace("]", " ").replace(",", " ")
    import re
    all_values = re.findall(r"\b[a-zA-Z0-9]+\b", cleaned)

    edges = []
    i = 0
    while i + 2 < len(all_values):
        a = all_values[i]
        b = all_values[i + 1]
        poids = float(all_values[i + 2])
        edges.append((a, b, poids))
        i += 3

    graph_pondere = {}
    for a, b, poids in edges:
        add_edge_pondere(graph_pondere, a, b, poids)
        add_edge_pondere(graph_pondere, b, a, poids)

    kruskal_steps = []

    return jsonify({
        "message": "Graph uploaded successfully for Kruskal's algorithm!",
        "graph": graph_pondere
    })

@app.route("/kruskal/execute", methods=["GET"])
def execute_kruskal():
    global graph_pondere, kruskal_steps

    if not graph_pondere:
        return jsonify({"error": "No graph available. Please upload a graph first."})

    kruskal_steps = []

    edges = []
    for node in graph_pondere:
        for neighbor, weight in graph_pondere[node]:
            if not any((e[0] == node and e[1] == neighbor) or (e[0] == neighbor and e[1] == node) for e in edges):
                edges.append((node, neighbor, weight))

    edges.sort(key=lambda x: x[2])
    kruskal_steps.append({
        "type": "start",
        "sorted_edges": edges.copy(),
        "tree_edges": [],
        "message": f"Starting Kruskal's algorithm with {len(edges)} edges sorted by weight"
    })

    parent = {}
    rank = {}

    for node in graph_pondere:
        parent[node] = node
        rank[node] = 0

    def find(node):
        if parent[node] != node:
            parent[node] = find(parent[node])
        return parent[node]

    def union(node1, node2):
        root1 = find(node1)
        root2 = find(node2)
        if root1 != root2:
            if rank[root1] > rank[root2]:
                parent[root2] = root1
            else:
                parent[root1] = root2
                if rank[root1] == rank[root2]:
                    rank[root2] += 1
            return True
        return False
    min_spanning_tree = []
    for edge in edges:
        node1, node2, weight = edge
        if union(node1, node2):
            min_spanning_tree.append(edge)
            kruskal_steps.append({
                "type": "add_edge",
                "edge": edge,
                "tree_edges": min_spanning_tree.copy(),
                "message": f"Adding edge {node1}-{node2} (weight: {weight}) to the MST"
            })
        else:
            kruskal_steps.append({
                "type": "skip_edge",
                "edge": edge,
                "tree_edges": min_spanning_tree.copy(),
                "message": f"Skipping edge {node1}-{node2} (weight: {weight}) as it would create a cycle"
            })

        if len(min_spanning_tree) == len(graph_pondere) - 1:
            break

    total_weight = sum(edge[2] for edge in min_spanning_tree)

    kruskal_steps.append({
        "type": "complete",
        "tree_edges": min_spanning_tree,
        "total_weight": total_weight,
        "message": f"Kruskal's algorithm complete. Total weight: {total_weight}"
    })
    return jsonify({
        "steps": kruskal_steps,
        "tree": min_spanning_tree,
        "total_weight": total_weight
    })

@app.route("/kruskal/steps", methods=["GET"])
def get_kruskal_steps():
    global kruskal_steps
    return jsonify({"steps": kruskal_steps})

# ---------------- Floyd -------------


# ------------ Floyd-Warshall Algorithm ---------------

floyd_steps = []
floyd_graph = {}

# Helper function to convert Infinity to None for JSON serialization
def prepare_matrix_for_json(matrix):
    if not matrix:
        return None
    return [[None if cell == float('inf') else cell for cell in row] for row in matrix]

@app.route("/floyd/upload", methods=["POST"])
def upload_file_floyd():
    global floyd_graph, floyd_steps
    
    try:
        file = request.files["file"]
        content = file.read().decode("utf-8")
        
        # 1. Parse the file strictly respecting the format [[a,b][w]]
        # We replace brackets with spaces to make it a long string of values
        cleaned = content.replace("[", " ").replace("]", " ").replace(",", " ")
        
        # Split by whitespace. This preserves negative signs (e.g. "-2")
        all_values = cleaned.split()
        
        edges = []
        i = 0
        while i + 2 < len(all_values):
            a = all_values[i]
            b = all_values[i + 1]
            try:
                # Ensure weight is a float/int, handling negative numbers
                poids = float(all_values[i + 2])
                edges.append((a, b, poids))
            except ValueError:
                pass # Skip if parsing fails
            i += 3
        
        # 2. Initialize graph
        floyd_graph = {}
        
        # Ensure all nodes exist in the dictionary keys first
        for a, b, poids in edges:
            if a not in floyd_graph: floyd_graph[a] = []
            if b not in floyd_graph: floyd_graph[b] = []

        # 3. Add Directed Edges
        # We do NOT force back-edges here. If the user wants A<->B, 
        # they must provide [[a,b][w1]] and [[b,a][w2]]
        for a, b, poids in edges:
            # Check for duplicates to prevent array bloat
            existing = next((x for x in floyd_graph[a] if x[0] == b), None)
            if existing:
                # Update weight if edge exists (or keep first, depending on preference)
                floyd_graph[a].remove(existing)
            floyd_graph[a].append((b, poids))
        
        floyd_steps = []
        
        return jsonify({
            "message": "Graph uploaded successfully!",
            "graph": floyd_graph
        })
    except Exception as e:
        print(e)
        return jsonify({"error": f"Error uploading file: {str(e)}"}), 500

@app.route("/floyd/get", methods=["GET"])
def get_floyd_graph():
    global floyd_graph
    if not floyd_graph:
        return jsonify({"error": "No graph available."})
    return jsonify({"graph": floyd_graph})

@app.route("/floyd/execute", methods=["GET"])
def execute_floyd():
    global floyd_graph, floyd_steps
    try:
        if not floyd_graph:
            return jsonify({"error": "No graph available."})

        floyd_steps = []
        nodes = sorted(list(floyd_graph.keys())) # Sort nodes for consistent matrix order
        n = len(nodes)
        
        node_index = {node: i for i, node in enumerate(nodes)}
        
        # Initialize distance matrix
        distance = [[float('inf')] * n for _ in range(n)]
        for i in range(n):
            distance[i][i] = 0
        
        # Initialize path matrix (Predecessor matrix)
        path = [[None] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                if i != j:
                    path[i][j] = i # Initially, predecessor is the start node
        
        # Fill based on Graph connections
        for node in floyd_graph:
            for neighbor, weight in floyd_graph[node]:
                i = node_index[node]
                j = node_index[neighbor]
                # If multiple edges defined, take the smallest weight
                if weight < distance[i][j]:
                    distance[i][j] = weight
        
        # Step 0: Initial State
        floyd_steps.append({
            "type": "initialization",
            "distance_matrix": prepare_matrix_for_json(distance),
            "path_matrix": prepare_matrix_for_json(path),
            "message": "Initial Matrix (k=0)"
        })
        
        # Floyd-Warshall Algorithm
        for k in range(n):
            # We want to show the matrix *after* processing node k
            
            for i in range(n):
                for j in range(n):
                    if distance[i][k] != float('inf') and distance[k][j] != float('inf'):
                        new_dist = distance[i][k] + distance[k][j]
                        if new_dist < distance[i][j]:
                            distance[i][j] = new_dist
                            path[i][j] = path[k][j] # Standard FW path reconstruction
            
            # --- SNAPSHOT HERE ---
            # Capture state only once per iteration of K
            floyd_steps.append({
                "type": "iteration_end",
                "k": k,
                "intermediate_node": nodes[k],
                "distance_matrix": prepare_matrix_for_json(distance),
                "path_matrix": prepare_matrix_for_json(path),
                "message": f"End of Iteration {k+1} (Intermediate Node: {nodes[k]})"
            })
        
        return jsonify({
            "steps": floyd_steps,
            "final_distance_matrix": prepare_matrix_for_json(distance),
            "final_path_matrix": prepare_matrix_for_json(path)
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error executing Floyd's algorithm: {str(e)}"}), 500



# ---------------- Welsh-Powell ----------------

# Store data in memory
welsh_powell_graph = {}
welsh_powell_steps = []

@app.route("/", methods=["GET"])
def server_status():
    return jsonify({"status": "online"})

@app.route("/welsh_powell/upload", methods=["POST", "OPTIONS"])
def upload_file_welsh_powell():
    global welsh_powell_graph, welsh_powell_steps
    
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
            
        file = request.files["file"]
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        content = file.read().decode("utf-8")
        print(f"--- FILE CONTENT RECEIVED ---\n{content}\n---------------------------")
        
        # Parse the file - this is the key fix
        # We need to properly parse the format [[A,B][2]],[[A,E][2]] etc.
        import re
        
        # Use regex to extract node pairs
        pattern = r'\[\[([A-Z]),([A-Z])\]\[[0-9]+\]\]'
        matches = re.findall(pattern, content)
        
        edges = []
        for match in matches:
            a, b = match
            edges.append((a, b))
        
        print(f"PARSED EDGES: {edges}")
        
        # Initialize graph
        welsh_powell_graph = {}
        
        # Ensure all nodes exist in the dictionary keys first
        for a, b in edges:
            if a not in welsh_powell_graph: welsh_powell_graph[a] = []
            if b not in welsh_powell_graph: welsh_powell_graph[b] = []

        # Add Undirected Edges
        for a, b in edges:
            # Check for duplicates
            if b not in welsh_powell_graph[a]:
                welsh_powell_graph[a].append(b)
            if a not in welsh_powell_graph[b]:
                welsh_powell_graph[b].append(a)
        
        print(f"FINAL GRAPH STRUCTURE: {welsh_powell_graph}")
        welsh_powell_steps = []
        
        return jsonify({
            "message": "Graph uploaded successfully!",
            "graph": welsh_powell_graph
        })
    except Exception as e:
        print(f"Error in upload: {str(e)}")
        return jsonify({"error": f"Error uploading file: {str(e)}"}), 500

@app.route("/welsh_powell/get", methods=["GET"])
def get_welsh_powell_graph():
    global welsh_powell_graph
    if not welsh_powell_graph:
        return jsonify({"error": "No graph available."})
    return jsonify({"graph": welsh_powell_graph})

@app.route("/welsh_powell/execute", methods=["GET"])
def execute_welsh_powell():
    global welsh_powell_graph, welsh_powell_steps
    
    if not welsh_powell_graph:
        return jsonify({"error": "No graph loaded"}), 400
    
    # Clear previous steps
    welsh_powell_steps = []
    
    # Get nodes and their degrees
    nodes = list(welsh_powell_graph.keys())
    degrees = {node: len(welsh_powell_graph[node]) for node in nodes}
    
    # Sort nodes by degree (descending)
    sorted_nodes = sorted(nodes, key=lambda x: degrees[x], reverse=True)
    
    # Initialize coloring
    coloring = {}
    colors_used = 0
    uncolored_nodes = sorted_nodes.copy()
    
    # Welsh-Powell algorithm
    while uncolored_nodes:
        # Start with the highest degree uncolored node
        current_color = colors_used
        nodes_to_color = [uncolored_nodes[0]]
        
        # Record initial step for this color
        welsh_powell_steps.append({
            "sorted_nodes": sorted_nodes,
            "degrees": degrees,
            "coloring": coloring.copy(),
            "last_colored": uncolored_nodes[0],
            "message": f"Starting color {current_color} with node {uncolored_nodes[0]}"
        })
        
        # Find all nodes that can be colored with the current color
        # (not adjacent to any node already colored with this color)
        for node in uncolored_nodes[1:]:
            can_color = True
            for colored_node in nodes_to_color:
                if node in welsh_powell_graph[colored_node]:
                    can_color = False
                    break
            
            if can_color:
                nodes_to_color.append(node)
        
        # Color all the nodes that can take this color
        for node in nodes_to_color:
            coloring[node] = current_color
            uncolored_nodes.remove(node)
        
        # Record step after coloring all nodes with this color
        welsh_powell_steps.append({
            "sorted_nodes": sorted_nodes,
            "degrees": degrees,
            "coloring": coloring.copy(),
            "last_colored": nodes_to_color,
            "message": f"Colored nodes {nodes_to_color} with color {current_color}"
        })
        
        colors_used += 1
    
    return jsonify({
        "steps": welsh_powell_steps,
        "coloring": coloring
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)