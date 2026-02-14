// Вставь свои данные из Supabase здесь
const SUPABASE_URL = 'https://nwaxiktgnyauxnlioafm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h8m6nVHJV2p8Um8ch7HA8A_TlrXQ3YZ';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

class AuthManager {
  // Регистрация
  async register(username, email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { display_name: username }
        }
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // Вход
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;
      
      // Сохраняем в localStorage для совместимости с твоим кодом
      const userData = { name: data.user.user_metadata.display_name, email: data.user.email };
      localStorage.setItem('hegir_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: "Ошибка входа" };
    }
  }
      } 
