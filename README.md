# Just a Couple Questions (JaCQ)

> "It's just gonna ask you a couple questions..."

A puzzle game where players try to leave no tip while navigating through increasingly challenging scenarios.

To play visit [JustACoupleQuestions.com](https://justacouplequestions.com).

## Features

- Multiple levels with increasing difficulty
- Progress saving using localStorage
- Level locking system
- Modern, responsive design
- Realistic tip calculator interface

## Development

To run the project locally:

1. Clone the repository
2. Run `yarn install`
3. Run `yarn start`

### Adding New Levels

The game is designed with reusable components, making it easy to add new levels. Here's how to add a new level:

1. Update `src/pages/meta/levels.json`:

```json
{
  "levels": [
    // ... existing levels ...
    {
      "id": 9,  // Increment from last level
      "title": "Your Level Title",
      "subtitle": "Your level subtitle or prompt...",
      "baseAmount": 50.00  // Base amount for the bill
    }
  ]
}
```

2. Create new level files:

```text
src/pages/09_LevelNinePage/
  ├── LevelNinePage.tsx
  └── LevelNinePage.css
```

3. Basic Level Template:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTipModal from '../../components/CustomTipModal/CustomTipModal';
import './LevelNinePage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import { getPercentageText } from '../../utils';

const LevelNinePage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCustomTipModal, setShowCustomTipModal] = useState(false);
    const [isCustomTip, setIsCustomTip] = useState(false);
    const level = levelData.levels[8]; // Index is id - 1
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();

    const handleSubmit = () => {
        localStorage.setItem('level9Tip', selectedTip?.toString() || '0');
        setShowModal(true);
    };

    // ... implement other handlers ...

    return (
        <motion.div className="level-container">
            {/* ... implement level UI ... */}
        </motion.div>
    );
};

export default LevelNinePage;
```

4. Key Components Available:
- `TipButton`: Standard tip percentage button
- `TipView`: Displays bill amount and calculated tip
- `LevelOverModal`: End-of-level completion modal
- `CustomTipModal`: Custom tip amount input modal
- `CustomTextModal`: Custom text/prompt modal

5. Local Storage Keys:
- `levelXTip`: Stores the tip percentage for level X
- These are used for:
  - Level progression/unlocking
  - Displaying completion status
  - Showing tip history

6. Level Design Considerations:
- Each level should have a unique challenge
- Use the shared CSS from `src/pages/shared/LevelPages.css`
- Add level-specific styles in the level's CSS file
- Consider using existing components in creative ways

7. Update Routes:
Add the new level route in your routing configuration:

```typescript
<Route path="9" element={<LevelNinePage />} />
```

8. Testing:
- Test level completion storage
- Verify level unlocking logic
- Check tip calculation accuracy
- Test mobile responsiveness
- Verify completion modal feedback

## Contributing

Open up an issue for a new level or feel free to open a PR to submit your own!