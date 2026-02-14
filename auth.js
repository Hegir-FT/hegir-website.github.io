// Вставь свои данные из Supabase здесь
const SUPABASE_URL = 'https://nwaxiktgnyauxnlioafm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53YXhpa3RnbnlhdXhubGlvYWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODc5MjMsImV4cCI6MjA4NjY2MzkyM30.e4GkyXzeSVceyDFHHSF2do7gGZx5QAnG3wjR80qsn6c';
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
