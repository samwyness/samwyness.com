import classNames from 'classnames';
import { JapanInkStamp } from './JapanInkStamp';
import {
  ChopstickWrapper,
  LiftPass,
  MonkeySign,
  Omikuji,
  ShinkansenTicket,
  SoySauceFish,
} from './Keepsakes';
import { FujiPostage, NozawaPostage, OsakaPostage } from './PostageStamps';
import { StationStamp } from './StationStamp';
import { TokyoSkyline } from './TokyoSkyline';

import styles from './StampBookPage.module.css';

/** Back of the print: a page from a Japan '23 travel stamp book, packed */
export function StampBookPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader} aria-hidden>
        <span>Japan</span>
        <span>日本</span>
        <span>&rsquo;23</span>
      </div>
      <TokyoSkyline className={styles.skyline} />
      {/* Stamped over the fortune slip, then stuck over in turn */}
      <Omikuji className={classNames(styles.keepsake, styles.omikuji)} />
      <JapanInkStamp className={styles.stamp} />
      <StationStamp className={styles.stationStamp} />
      <ShinkansenTicket
        className={classNames(styles.keepsake, styles.ticket)}
      />
      <MonkeySign className={classNames(styles.keepsake, styles.monkey)} />
      <SoySauceFish className={classNames(styles.keepsake, styles.soy)} />
      <ChopstickWrapper
        className={classNames(styles.keepsake, styles.chopsticks)}
      />
      <OsakaPostage className={classNames(styles.postage, styles.osaka)} />
      <FujiPostage className={classNames(styles.postage, styles.fuji)} />
      <NozawaPostage className={classNames(styles.postage, styles.nozawa)} />
      <LiftPass className={classNames(styles.keepsake, styles.liftPass)} />
    </div>
  );
}
