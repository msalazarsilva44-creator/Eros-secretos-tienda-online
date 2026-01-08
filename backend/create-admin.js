import bcrypt from 'bcrypt';

// Crear hash para la contraseña 'admin123'
const password = 'admin123';

bcrypt.hash(password, 10, async (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('\n================================');
  console.log('Hash generado para la contraseña "admin123":');
  console.log(hash);
  console.log('\nEjecuta este SQL:');
  console.log('UPDATE users SET password = \'' + hash + '\' WHERE email = \'admin@eros-secretos.com\';');
  console.log('================================\n');
});

