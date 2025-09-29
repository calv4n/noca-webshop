use `noca-db`;

-- user: admin@qua.ch // pw: admin
INSERT INTO user (email, password, username) VALUES ('admin@qua.ch', '$2a$10$yaKl0a0KEF4Hr3DXjJzqc.3qOohZ5NMbyXoACpyrTCatRcpSpZcoS', 'Administrator');
select * from user;