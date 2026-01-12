"""
External profile verification tools for Resume Parsing Agent.
Analyzes GitHub, coding platforms, and Stack Overflow profiles.
"""

import requests
from typing import Dict, Any, Optional
import re
from urllib.parse import urlparse


def analyze_github_profile(github_url: str) -> Dict[str, Any]:
    """
    Analyzes a GitHub profile and returns activity metrics.
    
    Args:
        github_url: GitHub profile URL (e.g., https://github.com/username)
    
    Returns:
        Dictionary with GitHub profile data including repos, stars, commits, languages
    """
    try:
        # Extract username from URL
        username = extract_github_username(github_url)
        if not username:
            return {
                "username": None,
                "repositories": 0,
                "stars": 0,
                "commits_last_year": 0,
                "top_languages": [],
                "notable_projects": [],
                "contribution_streak": None,
                "profile_accessible": False,
                "error_message": "Invalid GitHub URL format"
            }
        
        # GitHub API endpoint (no auth required for public data)
        user_url = f"https://api.github.com/users/{username}"
        repos_url = f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"
        
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Resume-Parser-Agent"
        }
        
        # Fetch user data
        user_response = requests.get(user_url, headers=headers, timeout=10)
        if user_response.status_code != 200:
            return {
                "username": username,
                "repositories": 0,
                "stars": 0,
                "commits_last_year": 0,
                "top_languages": [],
                "notable_projects": [],
                "contribution_streak": None,
                "profile_accessible": False,
                "error_message": f"GitHub API returned status {user_response.status_code}"
            }
        
        user_data = user_response.json()
        
        # Fetch repositories
        repos_response = requests.get(repos_url, headers=headers, timeout=10)
        repos_data = repos_response.json() if repos_response.status_code == 200 else []
        
        # Calculate metrics
        total_repos = user_data.get("public_repos", 0)
        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_data)
        
        # Get languages (from top repos)
        languages = {}
        notable_projects = []
        
        for repo in repos_data[:30]:  # Check top 30 repos
            # Count languages
            lang = repo.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
            
            # Identify notable projects (>= 10 stars or forks)
            stars = repo.get("stargazers_count", 0)
            forks = repo.get("forks_count", 0)
            if stars >= 10 or forks >= 5:
                notable_projects.append(f"{repo['name']} ({stars} stars, {forks} forks)")
        
        # Sort languages by frequency
        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)
        top_languages = [lang for lang, _ in top_languages[:5]]
        
        return {
            "username": username,
            "repositories": total_repos,
            "stars": total_stars,
            "commits_last_year": 0,  # Requires authenticated API or web scraping
            "top_languages": top_languages,
            "notable_projects": notable_projects[:5],
            "contribution_streak": None,  # Requires authenticated API
            "profile_accessible": True,
            "error_message": None
        }
    
    except requests.exceptions.RequestException as e:
        return {
            "username": username if 'username' in locals() else None,
            "repositories": 0,
            "stars": 0,
            "commits_last_year": 0,
            "top_languages": [],
            "notable_projects": [],
            "contribution_streak": None,
            "profile_accessible": False,
            "error_message": f"Network error: {str(e)}"
        }
    except Exception as e:
        return {
            "username": username if 'username' in locals() else None,
            "repositories": 0,
            "stars": 0,
            "commits_last_year": 0,
            "top_languages": [],
            "notable_projects": [],
            "contribution_streak": None,
            "profile_accessible": False,
            "error_message": f"Error analyzing GitHub profile: {str(e)}"
        }


def analyze_leetcode_profile(leetcode_url: str) -> Dict[str, Any]:
    """
    Analyzes a LeetCode profile using public GraphQL API.
    
    Args:
        leetcode_url: LeetCode profile URL (e.g., https://leetcode.com/username)
    
    Returns:
        Dictionary with LeetCode profile data including problems solved, rating
    """
    try:
        # Extract username
        username = extract_leetcode_username(leetcode_url)
        if not username:
            return {
                "platform": "LeetCode",
                "username": None,
                "rank": None,
                "problems_solved": 0,
                "easy_solved": 0,
                "medium_solved": 0,
                "hard_solved": 0,
                "contest_rating": None,
                "badges": [],
                "profile_accessible": False,
                "error_message": "Invalid LeetCode URL format"
            }
        
        # LeetCode GraphQL endpoint (public)
        url = "https://leetcode.com/graphql"
        
        query = """
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    ranking
                    reputation
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
                badges {
                    name
                }
            }
        }
        """
        
        payload = {
            "query": query,
            "variables": {"username": username}
        }
        
        headers = {
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com"
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return {
                "platform": "LeetCode",
                "username": username,
                "rank": None,
                "problems_solved": 0,
                "easy_solved": 0,
                "medium_solved": 0,
                "hard_solved": 0,
                "contest_rating": None,
                "badges": [],
                "profile_accessible": False,
                "error_message": f"LeetCode API returned status {response.status_code}"
            }
        
        data = response.json()
        matched_user = data.get("data", {}).get("matchedUser")
        
        if not matched_user:
            return {
                "platform": "LeetCode",
                "username": username,
                "rank": None,
                "problems_solved": 0,
                "easy_solved": 0,
                "medium_solved": 0,
                "hard_solved": 0,
                "contest_rating": None,
                "badges": [],
                "profile_accessible": False,
                "error_message": "User not found on LeetCode"
            }
        
        # Parse submission stats
        submit_stats = matched_user.get("submitStats", {}).get("acSubmissionNum", [])
        easy = medium = hard = total = 0
        
        for stat in submit_stats:
            difficulty = stat.get("difficulty", "")
            count = stat.get("count", 0)
            if difficulty == "Easy":
                easy = count
            elif difficulty == "Medium":
                medium = count
            elif difficulty == "Hard":
                hard = count
            elif difficulty == "All":
                total = count
        
        # Get ranking
        profile = matched_user.get("profile", {})
        ranking = profile.get("ranking")
        
        # Get badges
        badges = [badge.get("name") for badge in matched_user.get("badges", []) if badge.get("name")]
        
        return {
            "platform": "LeetCode",
            "username": username,
            "rank": f"#{ranking}" if ranking else None,
            "problems_solved": total,
            "easy_solved": easy,
            "medium_solved": medium,
            "hard_solved": hard,
            "contest_rating": None,  # Not available in public API
            "badges": badges[:5],
            "profile_accessible": True,
            "error_message": None
        }
    
    except requests.exceptions.RequestException as e:
        return {
            "platform": "LeetCode",
            "username": username if 'username' in locals() else None,
            "rank": None,
            "problems_solved": 0,
            "easy_solved": 0,
            "medium_solved": 0,
            "hard_solved": 0,
            "contest_rating": None,
            "badges": [],
            "profile_accessible": False,
            "error_message": f"Network error: {str(e)}"
        }
    except Exception as e:
        return {
            "platform": "LeetCode",
            "username": username if 'username' in locals() else None,
            "rank": None,
            "problems_solved": 0,
            "easy_solved": 0,
            "medium_solved": 0,
            "hard_solved": 0,
            "contest_rating": None,
            "badges": [],
            "profile_accessible": False,
            "error_message": f"Error analyzing LeetCode profile: {str(e)}"
        }


def analyze_stackoverflow_profile(stackoverflow_url: str) -> Dict[str, Any]:
    """
    Analyzes a Stack Overflow profile using public API.
    
    Args:
        stackoverflow_url: Stack Overflow profile URL (e.g., https://stackoverflow.com/users/123456/username)
    
    Returns:
        Dictionary with Stack Overflow profile data including reputation, answers, tags
    """
    try:
        # Extract user ID
        user_id = extract_stackoverflow_userid(stackoverflow_url)
        if not user_id:
            return {
                "user_id": None,
                "reputation": 0,
                "answers": 0,
                "questions": 0,
                "accept_rate": None,
                "top_tags": [],
                "gold_badges": 0,
                "silver_badges": 0,
                "bronze_badges": 0,
                "profile_accessible": False,
                "error_message": "Invalid Stack Overflow URL format"
            }
        
        # Stack Overflow API (no key needed for basic queries)
        base_url = "https://api.stackexchange.com/2.3"
        
        # Fetch user data
        user_url = f"{base_url}/users/{user_id}?site=stackoverflow"
        headers = {"Accept": "application/json"}
        
        response = requests.get(user_url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return {
                "user_id": user_id,
                "reputation": 0,
                "answers": 0,
                "questions": 0,
                "accept_rate": None,
                "top_tags": [],
                "gold_badges": 0,
                "silver_badges": 0,
                "bronze_badges": 0,
                "profile_accessible": False,
                "error_message": f"Stack Overflow API returned status {response.status_code}"
            }
        
        data = response.json()
        items = data.get("items", [])
        
        if not items:
            return {
                "user_id": user_id,
                "reputation": 0,
                "answers": 0,
                "questions": 0,
                "accept_rate": None,
                "top_tags": [],
                "gold_badges": 0,
                "silver_badges": 0,
                "bronze_badges": 0,
                "profile_accessible": False,
                "error_message": "User not found on Stack Overflow"
            }
        
        user = items[0]
        
        # Fetch top tags
        tags_url = f"{base_url}/users/{user_id}/top-tags?site=stackoverflow"
        tags_response = requests.get(tags_url, headers=headers, timeout=10)
        top_tags = []
        if tags_response.status_code == 200:
            tags_data = tags_response.json()
            top_tags = [tag.get("tag_name") for tag in tags_data.get("items", [])[:5]]
        
        badge_counts = user.get("badge_counts", {})
        
        return {
            "user_id": str(user_id),
            "reputation": user.get("reputation", 0),
            "answers": user.get("answer_count", 0),
            "questions": user.get("question_count", 0),
            "accept_rate": user.get("accept_rate"),
            "top_tags": top_tags,
            "gold_badges": badge_counts.get("gold", 0),
            "silver_badges": badge_counts.get("silver", 0),
            "bronze_badges": badge_counts.get("bronze", 0),
            "profile_accessible": True,
            "error_message": None
        }
    
    except requests.exceptions.RequestException as e:
        return {
            "user_id": user_id if 'user_id' in locals() else None,
            "reputation": 0,
            "answers": 0,
            "questions": 0,
            "accept_rate": None,
            "top_tags": [],
            "gold_badges": 0,
            "silver_badges": 0,
            "bronze_badges": 0,
            "profile_accessible": False,
            "error_message": f"Network error: {str(e)}"
        }
    except Exception as e:
        return {
            "user_id": user_id if 'user_id' in locals() else None,
            "reputation": 0,
            "answers": 0,
            "questions": 0,
            "accept_rate": None,
            "top_tags": [],
            "gold_badges": 0,
            "silver_badges": 0,
            "bronze_badges": 0,
            "profile_accessible": False,
            "error_message": f"Error analyzing Stack Overflow profile: {str(e)}"
        }


# ============================================================================
# Helper Functions for Username/ID Extraction
# ============================================================================

def extract_github_username(url: str) -> Optional[str]:
    """Extract GitHub username from URL."""
    try:
        # Handle various formats
        # https://github.com/username
        # github.com/username
        # username
        url = url.strip()
        if not url:
            return None
        
        # If it's already just a username
        if '/' not in url and '.' not in url:
            return url
        
        # Parse URL
        if not url.startswith('http'):
            url = 'https://' + url
        
        parsed = urlparse(url)
        path_parts = parsed.path.strip('/').split('/')
        
        if path_parts and path_parts[0]:
            return path_parts[0]
        
        return None
    except:
        return None


def extract_leetcode_username(url: str) -> Optional[str]:
    """Extract LeetCode username from URL."""
    try:
        url = url.strip()
        if not url:
            return None
        
        # If it's already just a username
        if '/' not in url and '.' not in url:
            return url
        
        # Parse URL
        if not url.startswith('http'):
            url = 'https://' + url
        
        parsed = urlparse(url)
        path_parts = parsed.path.strip('/').split('/')
        
        # LeetCode URLs: leetcode.com/username or leetcode.com/u/username
        if path_parts:
            if path_parts[0] == 'u' and len(path_parts) > 1:
                return path_parts[1]
            elif path_parts[0]:
                return path_parts[0]
        
        return None
    except:
        return None


def extract_stackoverflow_userid(url: str) -> Optional[str]:
    """Extract Stack Overflow user ID from URL."""
    try:
        url = url.strip()
        if not url:
            return None
        
        # If it's already just a number
        if url.isdigit():
            return url
        
        # Parse URL
        if not url.startswith('http'):
            url = 'https://' + url
        
        # Stack Overflow URLs: stackoverflow.com/users/123456/username
        match = re.search(r'/users/(\d+)', url)
        if match:
            return match.group(1)
        
        return None
    except:
        return None
