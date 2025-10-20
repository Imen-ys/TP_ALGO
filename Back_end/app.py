from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

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

# --- Routes ---
@app.route('/upload', methods=['POST'])
def upload_file():
    global root_abr
    file = request.files['file']
    content = file.read().decode('utf-8')

    # 🧹 Step 1: Remove all brackets and commas
    cleaned = content.replace('[', ' ').replace(']', ' ').replace(',', ' ')

    # 🧠 Step 2: Extract only numbers using regex
    import re
    all_numbers = re.findall(r'\d+', cleaned)
    all_numbers = [int(n) for n in all_numbers]

    # ⚙️ Step 3: Skip every 3rd element (assuming pattern [[a,b][c]])
    filtered = []
    for i in range(len(all_numbers)):
        # Skip every 3rd value
        if (i + 1) % 3 != 0:
            filtered.append(all_numbers[i])

    # 🪴 Step 4: Build ABR with filtered values
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

    filtered = [n for i, n in enumerate(all_numbers) if (i + 1) % 3 != 0]

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




if __name__ == "__main__":
    app.run(debug=True)

# # -------------------- TAS MIN (Min-Heap) --------------------
# class MinHeap:
#     def __init__(self):
#         self.heap = []

#     def insert(self, value):
#         self.heap.append(value)
#         self._heapify_up(len(self.heap) - 1)

#     def reset(self):
#         self.heap = []

#     def _heapify_up(self, index):
#         parent = (index - 1) // 2
#         if index > 0 and self.heap[index] < self.heap[parent]:
#             self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
#             self._heapify_up(parent)

#     def _to_tree_dict(self, index=0):
#         if index >= len(self.heap):
#             return None
#         left = self._to_tree_dict(2 * index + 1)
#         right = self._to_tree_dict(2 * index + 2)
#         return {
#             "name": str(self.heap[index]),
#             "children": [c for c in [left, right] if c]
#         }

#     def height(self, index=0):
#         if index >= len(self.heap):
#             return 0
#         return 1 + max(self.height(2 * index + 1), self.height(2 * index + 2))

#     def node_count(self):
#         return len(self.heap)

#     def max_degree(self, index=0):
#         if index >= len(self.heap):
#             return 0
#         degree = 0
#         if 2 * index + 1 < len(self.heap): degree += 1
#         if 2 * index + 2 < len(self.heap): degree += 1
#         return max(degree,
#                    self.max_degree(2 * index + 1),
#                    self.max_degree(2 * index + 2))

#     def density(self):
#         h = self.height()
#         n = self.node_count()
#         return n / h if h > 0 else 0


# heap = MinHeap()

# @app.route("/tasmin/insert", methods=["POST"])
# def insert_tasmin():
#     value = request.json["value"]
#     heap.insert(value)
#     return jsonify(heap._to_tree_dict())

# @app.route("/tasmin/reset", methods=["POST"])
# def reset_tasmin():
#     heap.reset()
#     return jsonify({"message": "TasMin reset!"})

# @app.route("/tasmin/info", methods=["GET"])
# def get_info_tasmin():
#     info = {
#         "height": heap.height(),
#         "degree": heap.max_degree(),
#         "density": heap.density(),
#     }
#     return jsonify(info)

# # -------------------- TAS MAX (Max-Heap) --------------------
# class MaxHeap:
#     def __init__(self):
#         self.heap = []

#     def insert(self, value):
#         self.heap.append(value)
#         self._heapify_up(len(self.heap) - 1)

#     def reset(self):
#         self.heap = []

#     def _heapify_up(self, index):
#         parent = (index - 1) // 2
#         if index > 0 and self.heap[index] > self.heap[parent]:  # différence avec MinHeap
#             self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
#             self._heapify_up(parent)

#     def _to_tree_dict(self, index=0):
#         if index >= len(self.heap):
#             return None
#         left = self._to_tree_dict(2 * index + 1)
#         right = self._to_tree_dict(2 * index + 2)
#         return {
#             "name": str(self.heap[index]),
#             "children": [c for c in [left, right] if c]
#         }

#     # --- Fonctions info ---
#     def height(self, index=0):
#         if index >= len(self.heap):
#             return 0
#         return 1 + max(self.height(2 * index + 1), self.height(2 * index + 2))

#     def node_count(self):
#         return len(self.heap)

#     def max_degree(self, index=0):
#         if index >= len(self.heap):
#             return 0
#         degree = 0
#         if 2 * index + 1 < len(self.heap): degree += 1
#         if 2 * index + 2 < len(self.heap): degree += 1
#         return max(degree,
#                    self.max_degree(2 * index + 1),
#                    self.max_degree(2 * index + 2))

#     def density(self):
#         h = self.height()
#         n = self.node_count()
#         return n / h if h > 0 else 0


# heap_max = MaxHeap()

# @app.route("/tasmax/insert", methods=["POST"])
# def insert_tasmax():
#     value = request.json["value"]
#     heap_max.insert(value)
#     return jsonify(heap_max._to_tree_dict())

# @app.route("/tasmax/reset", methods=["POST"])
# def reset_tasmax():
#     heap_max.reset()
#     return jsonify({"message": "TasMax reset!"})

# @app.route("/tasmax/info", methods=["GET"])
# def get_info_tasmax():
#     info = {
#         "height": heap_max.height(),
#         "degree": heap_max.max_degree(),
#         "density": heap_max.density(),
#     }
#     return jsonify(info)

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



# # ---------------- Graph orienté ----------------


# graph = {}

# # -------------------- Routes --------------------

# @app.route("/graphOr/add_node", methods=["POST"])
# def add_node():
#     data = request.json
#     node = data.get("node")
#     if node not in graph:
#         graph[node] = []
#     return jsonify({"graph": graph})

# @app.route("/graphOr/add_edge", methods=["POST"])
# def add_edge():
#     data = request.json
#     src = data.get("src")
#     dest = data.get("dest")

#     if src not in graph:
#         graph[src] = []
#     if dest not in graph:
#         graph[dest] = []

#     # Ajout arête orientée
#     graph[src].append(dest)
#     return jsonify({"graph": graph})

# @app.route("/graphOr/get", methods=["GET"])
# def get_graph():
#     return jsonify({"graph": graph})



# # Graphe pondéré représenté par dict : {sommet: [(dest, poids), ...]}
# graph = {}

# # ---------------- ROUTES ---------------- #

# @app.route("/graphpendere/add_node", methods=["POST"])
# def add_node_pondere():
#     data = request.json
#     node = data.get("node")
#     if node not in graph:
#         graph[node] = []
#     return jsonify({"graph": graph})

# @app.route("/graphpendere/add_edge", methods=["POST"])
# def add_edge_pondere():
#     data = request.json
#     src = data.get("src")
#     dest = data.get("dest")
#     weight = data.get("weight", 1)  # poids par défaut = 1

#     if src not in graph:
#         graph[src] = []
#     if dest not in graph:
#         graph[dest] = []

#     # Ajout arête pondérée
#     graph[src].append((dest, weight))
#     return jsonify({"graph": graph})

# @app.route("/graphpendere/get", methods=["GET"])
# def get_graph_pondere():
#     return jsonify({"graph": graph})
# # Graphe non pondéré représenté par dict : {sommet: [dest1, dest2, ...]}
# graph_nonpondere = {}

# @app.route("/graphnonpondere/add_node", methods=["POST"])
# def add_node_nonpondere():
#     data = request.json
#     node = data.get("node")
#     if node not in graph_nonpondere:
#         graph_nonpondere[node] = []
#     return jsonify({"graph": graph_nonpondere})

# @app.route("/graphnonpondere/add_edge", methods=["POST"])
# def add_edge_nonpondere():
#     data = request.json
#     src = data.get("src")
#     dest = data.get("dest")

#     if src not in graph_nonpondere:
#         graph_nonpondere[src] = []
#     if dest not in graph_nonpondere:
#         graph_nonpondere[dest] = []

#     graph_nonpondere[src].append(dest)
#     return jsonify({"graph": graph_nonpondere})

# @app.route("/graphnonpondere/get", methods=["GET"])
# def get_graph_nonpondere():
#     return jsonify({"graph": graph_nonpondere})



# graph = {}

# # -------------------- Routes --------------------

# #  Ajouter un sommet
# @app.route("/graphNonOr/add_node", methods=["POST"])
# def add_node_non_oriente():
#     data = request.json
#     node = data.get("node")
#     if node not in graph:
#         graph[node] = []
#     return jsonify({"graph": graph})

# #  Ajouter une arête (non orientée)
# @app.route("/graphNonOr/add_edge", methods=["POST"])
# def add_edge_non_oriente():
#     data = request.json
#     src = data.get("src")
#     dest = data.get("dest")

#     if src not in graph:
#         graph[src] = []
#     if dest not in graph:
#         graph[dest] = []

#     # Ajouter l'arête dans les deux sens
#     if dest not in graph[src]:
#         graph[src].append(dest)
#     if src not in graph[dest]:
#         graph[dest].append(src)

#     return jsonify({"graph": graph})

# #  Obtenir le graphe complet
# @app.route("/graphNonOr/get", methods=["GET"])
# def get_graph_non_oriente():
#     return jsonify({"graph": graph})

# #  Nombre de sommets
# @app.route("/graphNonOr/count_nodes", methods=["GET"])
# def count_nodes_non_oriente():
#     return jsonify({"count_nodes": len(graph)})

# #  Nombre d’arêtes
# @app.route("/graphNonOr/count_edges", methods=["GET"])
# def count_edges_non_oriente():
#     count = sum(len(v) for v in graph.values()) // 2
#     return jsonify({"count_edges": count})

# # -------------------- Main --------------------
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
