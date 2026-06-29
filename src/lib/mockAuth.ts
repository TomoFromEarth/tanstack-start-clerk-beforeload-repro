export async function auth() {
  return {
    userId: 'user_mock_repro',
    getToken: async () => 'token_mock_repro',
  }
}
