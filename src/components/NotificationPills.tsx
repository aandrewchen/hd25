interface NotificationPillsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function NotificationPills({
  activeCategory,
  onCategoryChange,
}: NotificationPillsProps) {
  const categories = ["All", "Repairs", "Rent"];

  return (
    <div className="flex space-x-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === category
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
