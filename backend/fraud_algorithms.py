import networkx as nx

def detect_routing_cycles(transactions_list):
    """
    Takes a list of transaction dictionaries/objects.
    Returns a list of cycles found in the network.
    """
    # Initialize a directed graph
    G = nx.DiGraph()
    
    # Add edges to the graph based on transactions
    for tx in transactions_list:
        G.add_edge(tx['sender_id'], tx['receiver_id'], transaction_id=tx['tx_id'])
    
    # Find all simple cycles (circular routing paths)
    cycles = list(nx.simple_cycles(G))
    
    # Filter out empty or self-loops (e.g., A -> A)
    fraud_cycles = [cycle for cycle in cycles if len(cycle) > 1]
    
    return fraud_cycles