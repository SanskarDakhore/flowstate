# Repositories

Data access layer. Abstracts database queries behind clean interfaces.

Repositories must:
- Handle all direct database interactions
- Return domain objects, not raw query results
- Be swappable for testing (interface-based)

Repositories must NOT:
- Contain business logic
- Know about HTTP or Express
