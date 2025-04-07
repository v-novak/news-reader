import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewsFeed() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 25,
    total: 0
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const { pageNumber, tag } = useParams();
  const navigate = useNavigate();

  const fetchPublications = async (page, tag=null) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        fields: 'image.url,tags.name,content,title,customDate,createdAt,publishedAt,updatedAt,assetIds',
        pageSize: pagination.pageSize,
        pageNumber: page
      };

      // Add tag filter if we're on a tag route
      if (tag) {
        params['filters.tags.attributes.name'] = tag;
      }

      const response = await axios.get(
        'https://api.qa.zfx.com/content-management/v1/publications',
        { params }
      );
      setPublications(response.data.result || []);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch publications. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use page 1 if pageNumber is not provided in the URL
    const page = pageNumber ? parseInt(pageNumber, 10) : 1;
    fetchPublications(page, tag);
  }, [pageNumber, tag]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const areDatesEqual = (date1, date2) => {
    if (!date1 || !date2) return false;
    const time1 = new Date(date1).getTime();
    const time2 = new Date(date2).getTime();
    const diffInSeconds = Math.abs(time1 - time2) / 1000;
    return diffInSeconds <= 3600;
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    if (newPage >= 1 && newPage <= totalPages) {
      // Use the appropriate URL format based on whether we're in tag view
      const path = tag ? `/tag/${tag}/page/${newPage}` : `/page/${newPage}`;
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const handleArticleClick = (publication) => {
    setSelectedArticle(publication);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const renderModal = () => {
    if (!selectedArticle) return null;

    const attrs = selectedArticle.attributes;

    // Function to process HTML content and add Bootstrap classes
    const processContent = (content) => {
      // Create a temporary div to manipulate the content
      const div = document.createElement('div');
      div.innerHTML = content;

      // Remove all script tags
      div.querySelectorAll('script').forEach(script => script.remove());

      // Add Bootstrap classes to elements
      div.querySelectorAll('p').forEach(p => {
        p.classList.add('mb-3');
      });

      div.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        heading.classList.add('mt-4', 'mb-3');
      });

      div.querySelectorAll('ul, ol').forEach(list => {
        list.classList.add('mb-3');
      });

      div.querySelectorAll('img').forEach(img => {
        img.classList.add('img-fluid', 'my-3', 'rounded');
      });

      div.querySelectorAll('blockquote').forEach(quote => {
        quote.classList.add('blockquote', 'border-start', 'border-4', 'ps-4', 'my-4');
      });

      div.querySelectorAll('pre').forEach(pre => {
        pre.classList.add('bg-light', 'p-3', 'rounded', 'my-3');
      });

      div.querySelectorAll('code').forEach(code => {
        code.classList.add('bg-light', 'px-2', 'py-1', 'rounded');
      });

      div.querySelectorAll('table').forEach(table => {
        table.classList.add('table', 'table-bordered', 'my-3');
      });

      div.querySelectorAll('a').forEach(link => {
        link.classList.add('text-primary');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

      return div.innerHTML;
    };

    return (
      <>
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{attrs.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {attrs.image?.data?.attributes?.url && (
                  <img
                    src={attrs.image.data.attributes.url}
                    className="img-fluid mb-4 rounded w-100"
                    alt={attrs.title}
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                )}
                <div className="mb-4">
                  <div className="text-muted small">
                    <div>{formatDate(attrs.publishedAt)}</div>
                    {attrs.updatedAt && !areDatesEqual(attrs.updatedAt, attrs.publishedAt) && (
                      <div>Updated: {formatDate(attrs.updatedAt)}</div>
                    )}
                  </div>
                </div>
                {attrs.tags?.data && attrs.tags.data.length > 0 && (
                  <div className="mb-4">
                    {attrs.tags.data.map((tag) => (
                      <span
                        key={tag.id}
                        className="badge bg-secondary me-1"
                      >
                        {tag.attributes.name}
                      </span>
                    ))}
                  </div>
                )}
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ 
                    __html: processContent(attrs.content)
                  }}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
        <style>
          {`
            .article-content {
              font-size: 1.1rem;
              line-height: 1.6;
              color: #2c3e50;
            }
            .article-content h1 { font-size: 2.2rem; }
            .article-content h2 { font-size: 1.8rem; }
            .article-content h3 { font-size: 1.5rem; }
            .article-content h4 { font-size: 1.3rem; }
            .article-content h5 { font-size: 1.1rem; }
            .article-content h6 { font-size: 1rem; }
            .article-content img {
              max-width: 100%;
              height: auto;
            }
            .article-content pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .article-content blockquote {
              font-style: italic;
              color: #666;
            }
            .article-content ul, .article-content ol {
              padding-left: 2rem;
            }
            .article-content table {
              width: 100%;
              margin-bottom: 1rem;
            }
            .article-content code {
              font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              font-size: 0.9em;
            }
          `}
        </style>
      </>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const currentPage = parseInt(pageNumber, 10);
    
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <li key={1} className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      pages.push(
        <li key={totalPages} className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {pages}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="row g-4">
        {publications.map((publication) => (
          <div key={publication.id} className="col-md-6 col-lg-4">
            <div 
              className="card h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleArticleClick(publication)}
            >
              {publication.attributes.image?.data?.attributes?.url && (
                <img
                  src={publication.attributes.image.data.attributes.url}
                  className="card-img-top"
                  alt={publication.attributes.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{publication.attributes.title}</h5>
                <div className="card-text text-muted small mb-2">
                  <div>{formatDate(publication.attributes.publishedAt)}</div>
                  {publication.attributes.updatedAt && !areDatesEqual(publication.attributes.updatedAt, publication.attributes.publishedAt) && (
                    <div>Updated: {formatDate(publication.attributes.updatedAt)}</div>
                  )}
                </div>
                {publication.attributes.tags?.data && publication.attributes.tags.data.length > 0 && (
                  <div className="mt-2">
                    {publication.attributes.tags.data.map((tag) => (
                      <span
                        key={tag.id}
                        className="badge bg-secondary me-1"
                      >
                        {tag.attributes.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
      {selectedArticle && renderModal()}
    </>
  );
}

export default NewsFeed; 