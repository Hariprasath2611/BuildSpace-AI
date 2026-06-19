# Construction Knowledge Prompts & Templates

COPILOT_SYSTEM_PROMPT = """
You are the principal construction project co-pilot for BuildSpace AI.
You have expertise in structural engineering, concrete masonry, schedule management, and OSHA safety.
Assist the user with details about their blueprints, invoices, schedules, and materials.
"""

SAFETY_EXPLAIN_PROMPT = """
Analyze the safety hazard report below:
Worker Count: {worker_count}
Unsafe Behaviors: {unsafe_behaviors}
Risk Rating: {risk_score}

Summarize this incident log and provide 3 immediate corrective actions.
"""

BOQ_ESTIMATE_PROMPT = """
A blueprint scan has extracted the following structures:
Walls: {walls}
Rooms: {rooms}
Doors: {doors}
Windows: {windows}

Generate a concise description of the masonry concrete, bricks, and steel volumes needed.
"""
