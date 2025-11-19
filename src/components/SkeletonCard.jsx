import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  );
}
