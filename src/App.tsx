import { useEffect, useState } from 'react';
import * as S from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moveCount, setMoveCount] = useState<number>(0);
    const [showCount, setShowCount] = useState<number>(0);
    const [gridItems, setGridItems] = useState<GridItemType[]>([]);

    useEffect(() => resetAndCreateGrid(), []);

    useEffect(() => {
        const timer = setInterval(() => {
            if(playing) setTimeElapsed(timeElapsed + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [playing, timeElapsed]);

    useEffect(() =>{
        if(showCount ==2) {
            let opned = gridItems.filter(item => item.shown === true);
            if(opned.length === 2) {

                if(opned[0].item === opned[1].item) {
                    let tmpGrid = [...gridItems];
                    for(let i in tmpGrid) {
                        if(tmpGrid[i].shown) {
                            tmpGrid[i].permanentShown = true;
                            tmpGrid[i].shown = false;
                        }
                    }
                    setGridItems(tmpGrid);
                    setShowCount(0);

                } else {
                    setTimeout(() => {
                        let tmpGrid = [...gridItems];
                        for(let i in tmpGrid) {
                            tmpGrid[i].shown = false;
                        }
                        setGridItems(tmpGrid);
                        setShowCount(0);
                    }, 1000);
                }

                setMoveCount(moveCount => moveCount + 1);
            }
        }
    }, [showCount, gridItems]);

    useEffect(() => {
        if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
            setPlaying(false);
        }
    }, [moveCount, gridItems]);

    const resetAndCreateGrid = () => {
        setTimeElapsed(0);
        setMoveCount(0);
        setShowCount(0);

        let tmpGrid: GridItemType[] = [];
        for(let i = 0; i < (items.length * 2); i++) tmpGrid.push({
            item: null, shown: false, permanentShown: false
        });
        

        for(let w = 0; w < 2; w++) {
            for(let i = 0; i < items.length; i++) {
                let pos = -1;
                while(pos < 0 || tmpGrid[pos].item !== null) {
                    pos = Math.floor(Math.random() * (items.length * 2));
                }
                tmpGrid[pos].item = i;
            }
        }

        setGridItems(tmpGrid)
        setPlaying(true);
    }

    const handleItemClick = (index: number) => {
        if(playing && index !== null && showCount < 2) {
            let tmpGrid = [...gridItems];
            if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
                tmpGrid[index].shown = true;
                setShowCount(showCount + 1);
            }
            setGridItems(tmpGrid);
        }
    }

    return (
        <S.Container>
            <S.Info>
                <S.LogoLink href=''>
                    <img src={logoImage} width='200' alt='' />
                </S.LogoLink>
                
                <S.InfoArea>
                    <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
                    <InfoItem label='Movimentos' value={moveCount.toString()} />
                </S.InfoArea>

                <Button label='Reniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
            </S.Info>

            <S.GridArea>
                <S.Grid>
                    {gridItems.map((item, index) =>(
                        <GridItem
                            key={index}
                            item={item}
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </S.Grid>
            </S.GridArea>
        </S.Container>
    );
}

export default App;