from utils.ai_resume_rewriter import rewrite_resume


sample_resume = """

Python developer with ML knowledge.
Built some projects in AI and web development.

"""

result = rewrite_resume(sample_resume)

print(result)