"""
BlackRoad OS Python SDK
"""

from setuptools import setup, find_packages

setup(
    name="blackroad",
    version="0.1.0",
    author="BlackRoad OS, Inc.",
    author_email="sdk@blackroad.io",
    description="Official Python SDK for BlackRoad OS",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/BlackRoad-OS/blackroad-python-sdk",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: Other/Proprietary License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.9",
    install_requires=[
        "httpx>=0.24.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-asyncio>=0.21",
            "black>=23.0",
            "mypy>=1.0",
        ],
    },
)
