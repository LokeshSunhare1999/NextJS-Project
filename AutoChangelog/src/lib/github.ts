import axios from 'axios'

export class GitHubService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async getRepositories() {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${this.token}` },
    })
    return response.data
  }

  async getCommits(owner: string, repo: string, since?: string) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
        params: { since },
      }
    )
    return response.data
  }

  async getTags(owner: string, repo: string) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/tags`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    )
    return response.data
  }
}
