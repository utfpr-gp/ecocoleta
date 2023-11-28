ALTER TABLE users ADD COLUMN activo boolean;
UPDATE users SET activo = true;
ALTER TABLE users ALTER COLUMN activo SET NOT NULL;
